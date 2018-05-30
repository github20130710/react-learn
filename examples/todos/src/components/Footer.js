import React from 'react'
import FilterLink from '../containers/FilterLink'
import { VisibilityFilters } from '../actions'

const Footer = () => (
  <div className="row filter">
    <span>过滤: </span>
    <FilterLink filter={VisibilityFilters.SHOW_ALL}>
      全部
    </FilterLink>
    <FilterLink filter={VisibilityFilters.SHOW_ACTIVE}>
      激活中
    </FilterLink>
    <FilterLink filter={VisibilityFilters.SHOW_COMPLETED}>
      已完成
    </FilterLink>
  </div>
)

export default Footer