import React from 'react'
import styled from 'styled-components';
import { Paper, Collapse, FormGroup, FormControlLabel, Switch } from '@material-ui/core'
import { AppBarWrapper } from './index.style';

const Wrapper = styled(AppBarWrapper)`

`
const StyledPaper = styled(Paper)`
  border-radius: 0 !important;
`

const StyledFormGroup = styled(FormGroup)`
  padding: ${({ theme }) => theme.spacing(1)}px ${({ theme }) => theme.spacing(2)}px;
`
const FiltersExpansion = ({ dispatch, veg, sortByDate, expanded, search, hideNew }) => {
  return (
    <Wrapper
      elevation={1}
      square
      component="div"
    >
      <Collapse in={expanded} timeout="auto" unmountOnExit component={StyledPaper}>
          <StyledFormGroup row>
            <FormControlLabel
              label="Végétarien"
              control={
                <Switch
                  checked={veg}
                  onChange={() => dispatch({ type: 'TOGGLE_VEG' })}
                  color="primary"
                />
              }
            />
            <FormControlLabel
              label="Ranger par date"
              control={
                <Switch
                  checked={sortByDate}
                  onChange={() => dispatch({ type: 'TOGGLE_SORT_BY_DATE' })}
                  color="primary"
                  disabled={Boolean(search)}
                />
              }
            />
            <FormControlLabel
              label="Cacher nouvelles"
              control={
                <Switch
                  checked={hideNew}
                  onChange={() => dispatch({ type: 'TOGGLE_HIDE_NEW' })}
                  color="primary"
                />
              }
            />
          </StyledFormGroup>
      </Collapse>
    </Wrapper>

  )
}

export default FiltersExpansion
