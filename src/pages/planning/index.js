import React from 'react'
import HeaderBar from '../../HeaderBar'
import Planning from '../../Planning'

import { useRecipesState } from '../../contexts/recipes'
import { usePlanningState } from '../../contexts/planning'
import { BoxNextAppBar } from '../../HeaderBar/index.style'

const PlanningPage = ({ navigate }) => {
  const { isLoading: recipesLoading } = useRecipesState();
  const { isLoading: planningLoading } = usePlanningState();
  return (
    <>
      <HeaderBar isLoading={recipesLoading || planningLoading}/>
      <BoxNextAppBar>
        <Planning {...{ navigate }} />
      </BoxNextAppBar>
    </>
  )
}

export default PlanningPage
