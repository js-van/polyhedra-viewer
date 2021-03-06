// @flow strict
import _ from 'lodash';

import { flatMap } from 'utils';
import { withOrigin } from 'math/linAlg';
import { Cap } from 'math/polyhedra';
import type { Operation } from '../operationTypes';
import { mapObject } from 'utils';
import { getCapAlignment, getGyrateDirection } from './cutPasteUtils';
import { getTransformedVertices } from '../operationUtils';

const TAU = 2 * Math.PI;

interface GyrateOptions {
  cap: Cap;
}

function applyGyrate(polyhedron, { cap }) {
  // get adjacent faces
  const boundary = cap.boundary();

  // rotate the cupola/rotunda top
  const theta = TAU / boundary.numSides;

  const oldToNew = mapObject(boundary.vertices, (vertex, i) => [
    vertex.index,
    i,
  ]);

  const mockPolyhedron = polyhedron.withChanges(solid =>
    solid.addVertices(boundary.vertices).mapFaces(face => {
      if (face.inSet(cap.faces())) {
        return face;
      }
      return face.vertices.map(v => {
        return v.inSet(boundary.vertices)
          ? polyhedron.numVertices() + oldToNew[v.index]
          : v.index;
      });
    }),
  );

  const endVertices = getTransformedVertices(
    [cap],
    p =>
      withOrigin(p.normalRay(), v => v.getRotatedAroundAxis(p.normal(), theta)),
    mockPolyhedron.vertices,
  );

  // TODO the animation makes the cupola shrink and expand.
  // Make it not do that.
  return {
    animationData: {
      start: mockPolyhedron,
      endVertices,
    },
  };
}

export const gyrate: Operation<GyrateOptions> = {
  apply: applyGyrate,

  getSearchOptions(polyhedron, config, relations) {
    const options = {};
    const { cap } = config;
    if (!cap) {
      throw new Error('Invalid cap');
    }
    // TODO can we not rely on relations?
    if (_.some(relations, 'direction')) {
      options.direction = getGyrateDirection(polyhedron, cap);
      if (
        _.filter(
          relations,
          relation =>
            relation.direction === options.direction && !!relation.align,
        ).length > 1
      ) {
        options.align = getCapAlignment(polyhedron, cap);
      }
    }
    return options;
  },

  getAllOptions(polyhedron) {
    return Cap.getAll(polyhedron).map(cap => ({ cap }));
  },

  getHitOption(polyhedron, hitPnt) {
    const cap = Cap.find(polyhedron, hitPnt);
    return cap ? { cap } : {};
  },

  getSelectState(polyhedron, { cap }) {
    const allCapFaces = flatMap(Cap.getAll(polyhedron), cap => cap.faces());
    return _.map(polyhedron.faces, face => {
      if (_.isObject(cap) && face.inSet(cap.faces())) return 'selected';
      if (face.inSet(allCapFaces)) return 'selectable';
    });
  },
};
