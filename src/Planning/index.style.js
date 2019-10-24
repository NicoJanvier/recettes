import styled from 'styled-components';
import { Grid, Typography, Fab, Dialog } from '@material-ui/core';

const GridRow = styled(Grid)`
  border-radius: ${({ theme }) => theme.radius.m};
  width: 100%;
  border: 2px dashed lightgrey;
`

const DateText = styled(Typography)`
  display: inline-block;
  &:not(:last-child) {
    padding-right: ${({ theme }) => theme.spacing(1)}px;
  }
`

const AddBtnCard = styled(Grid)`
  display: flex;
  justify-content: flex-end;
`

const RemoveButton = styled(Fab)`
  position: absolute;
  top: 4px;
  right: 4px;
  min-height: 0px;

  width: 25px;
  height: 25px;
  transform: scale(0);
  transition: all .5s;

  svg {
    width: .8em;
    height: .8em;
  }
`

const RecipeCardWrapper = styled(Grid)`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
  position: relative;
  &:hover {
    & .MuiCard-root {
      background-color: "rgba(0, 0, 0, 0.01)"
    }
    & ${RemoveButton} {
      min-width: 25px;
      min-height: 25px;
      transform: scale(1);
    }
  }
`

const DialogWrapper = styled(Dialog)`
  .paper {
    height: 100%;
  }
  .content {
    padding: 0;
  }
  .dividers {
    border-top: none;
  }
`

export {
  GridRow,
  DateText,
  AddBtnCard,
  RecipeCardWrapper,
  RemoveButton,
  DialogWrapper
}