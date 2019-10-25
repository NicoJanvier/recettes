import React from "react";
import styled from 'styled-components';
import useForm from "react-hook-form";
import { navigate } from "@reach/router";
import {
  Container,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import useRecipe from "./hooks/useRecipe";
import { useUserState } from "../contexts/user";
import DeleteDialog from "./dialog";

const Paper = styled(Grid)`
  margin-top: ${({ theme }) => theme.spacing(3)}px;
`
const Buttons = styled(Grid)`
  display: flex;
  flex-direction: column;
  > button {
    flex-basis: 100%;
    & + button {
      margin-top: ${({ theme }) => theme.spacing(2)}px;
    }
  }
  ${({ theme }) => theme.breakpoints.up("sm")} {
    flex-direction: row;
    justify-content: flex-end;
    > button {
      flex-basis: auto;
      & + button {
        margin-top: 0;
        margin-left: ${({ theme }) => theme.spacing(2)}px;
      }
    }
  }
`
const Recipe = ({ id }) => {
  const { recipe, isLoading, onRemove, onSave } = useRecipe(id);
  const { house } = useUserState();
  const canModify = id === 'new' || recipe.house === house.id;
  const isRecipeEmpty = !recipe.title;
  const { register, errors, handleSubmit, formState } = useForm();

  const onSubmit = data => {
    onSave({
      ...data,
    })
      .then((res) => {
        if (id === "new") {
          const id = res.data.data._id;
          navigate(`/recipes/${id}`, { replace: true });
        }
      })
      .catch(err => console.error(err));
  };
  const onDelete = () => onRemove().then(() => window.history.back());
  const [open, setOpen] = React.useState(false)
  return (
    <Container key={id}>
      {!(isLoading && isRecipeEmpty) &&
        <Paper
          container
          spacing={2}
          component="form"
          onSubmit={handleSubmit(data => onSubmit(data))}
        >
          <Grid item xs={12}>
            <TextField
              name="title"
              label="Titre"
              required
              multiline
              fullWidth
              inputRef={register({ required: true })}
              error={!!errors.title}
              defaultValue={recipe.title}
              inputProps={{ readOnly: !canModify }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              multiline
              fullWidth
              inputRef={register}
              defaultValue={recipe.description}
              inputProps={{ readOnly: !canModify }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Lien"
              name="url"
              type="url"
              defaultValue={recipe.url}
              fullWidth
              inputRef={register}
              inputProps={{ readOnly: !canModify }}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      component="a"
                      aria-label="Open link"
                      disabled={!recipe.url}
                      href={recipe.url}
                      rel="noopener"
                      target="_blank"
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={recipe.vegetarian}
                  name="vegetarian"
                  inputRef={register}
                />
              }
              label="Végétarien"
              labelPlacement="end"
            />
          </Grid>
          <Buttons item xs={12}>
            {canModify &&
              <Button
                type="submit"
                disabled={!formState.dirty}
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
              >
                Sauvegarder
                </Button>
            }
            {(id !== "new") && canModify &&
              <>
                <Button
                  onClick={() => setOpen(true)}
                  variant="contained"
                  startIcon={<DeleteIcon />}
                >
                  Supprimer
                </Button>
                <DeleteDialog {...{ open, setOpen, onDelete }} />
              </>
            }
          </Buttons>
        </Paper>}
    </Container>
  );
};


export default Recipe;
