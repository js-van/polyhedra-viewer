import React from 'react'
import { css, StyleSheet } from 'aphrodite/no-important'

import { andaleMono } from '../styles/fonts'
import { transition } from '../styles/common'
import Icon from './Icon'

const styles = StyleSheet.create({
  searchBar: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center',
    padding: 10,
    width: '100%',
    position: 'relative',
  },

  input: {
    ...transition('border-color', .35),
    width: '100%',
    height: 36,
    paddingLeft: 30,

    border: '2px LightGray solid',
    borderRadius: 28,

    fontSize: 14,
    fontFamily: andaleMono,

    ':focus': {
      outline: 'none',
      borderColor: 'Gray',
    }
  },

  icon: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    color: 'LightGray',
  },
})

export default function SearchBar({ text, setValue }) {

  // TODO make the icon light up as well;
  // might have to use onFocus/onBlur to do it with aphrodite
  return (
    <label className={css(styles.searchBar)}>
      <input
        type="text"
        placeholder="Search..."
        value={text}
        onChange={e => setValue(e.target.value)}
        className={css(styles.input)}
      />
      <span className={css(styles.icon)}>
        <Icon name="search" />
      </span>
    </label>
  )
}
