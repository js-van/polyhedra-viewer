import _ from 'lodash'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { css, StyleSheet } from 'aphrodite/no-important'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { getFilteredGroups } from 'selectors'
import { escapeName } from 'constants/polyhedra'
import { andaleMono } from 'styles/fonts'
import { resetLink, hover } from 'styles/common'

import SearchBar from './SearchBar'
import GroupHeader from './GroupHeader'
import SubgroupHeader from './SubgroupHeader'

const PolyhedronLink = ({ name }) => {
  const styles = StyleSheet.create({
    link: {
      ...resetLink,
      ...hover,
      display: 'block',
      padding: '3px 14px',

      color: 'DimGrey',
      lineHeight: '18px',
      fontFamily: andaleMono,
      fontSize: 14,
    },

    isActive: {
      color: 'DarkSlateGray',
      fontWeight: 'bolder',
    },
  })

  return (
    <NavLink
      to={`/${escapeName(name)}/list`}
      className={css(styles.link)}
      activeClassName={css(styles.isActive)}
    >
      {_.capitalize(name)}
    </NavLink>
  )
}

const SubList = ({ polyhedra }) => {
  return (
    <ul>
      {polyhedra.map(name => (
        <li key={name}>
          <PolyhedronLink name={name} />
        </li>
      ))}
    </ul>
  )
}

const Subgroup = ({ name, polyhedra }) => {
  const styles = StyleSheet.create({
    subgroup: {
      margin: '18px 0',
    },

    header: {
      margin: '3px 12px',
    },
  })

  return (
    <div className={css(styles.subgroup)}>
      <SubgroupHeader name={name} styles={styles.header} />
      <SubList polyhedra={polyhedra} />
    </div>
  )
}

const PolyhedronGroup = ({ group }) => {
  const { display, polyhedra, groups } = group
  const styles = StyleSheet.create({
    group: {
      padding: '10px 0',
    },

    header: {
      margin: '5px 12px',
    },
  })

  return (
    <div className={css(styles.group)}>
      <GroupHeader text={display} styles={styles.header} />
      {polyhedra && <SubList polyhedra={polyhedra} />}
      {groups && (
        <div className={css(styles.subgroups)}>
          {groups.map(group => <Subgroup key={group.name} {...group} />)}
        </div>
      )}
    </div>
  )
}

const PolyhedronList = ({ groups }) => (
  <div>
    <SearchBar />
    {groups.map(({ name, ...group }) => (
      <PolyhedronGroup key={name} group={group} />
    ))}
  </div>
)

const mapStateToProps = createStructuredSelector({
  groups: getFilteredGroups,
})

export default connect(mapStateToProps)(PolyhedronList)