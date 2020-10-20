import React from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Button           from '@material-ui/core/Button';
import Dialog           from '@material-ui/core/Dialog';
import MuiDialogTitle   from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton       from '@material-ui/core/IconButton';
import CloseIcon        from '@material-ui/icons/Close';
import Typography       from '@material-ui/core/Typography';

import List             from '@material-ui/core/List';
import ListItem         from '@material-ui/core/ListItem';
import ListItemText     from '@material-ui/core/ListItemText';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export interface NewPuzzleProps {
    open?: boolean,
    onClose: () => void
};

export default function NewPuzzleDialog(props: NewPuzzleProps) {
    return (
        <div>
            <Dialog onClose={ props.onClose } aria-labelledby="customized-dialog-title" open={!!props.open}>
                <DialogTitle id="customized-dialog-title" onClose={ props.onClose }>
                    New Puzzle
                </DialogTitle>

                <DialogContent dividers>
                    <List>
                        <ListItem button key="easy">
                            <ListItemText primary="Easy" />
                        </ListItem>
                        <ListItem button key="medium">
                            <ListItemText primary="Medium" />
                        </ListItem>
                        <ListItem button key="hard">
                            <ListItemText primary="Hard" />
                        </ListItem>
                        <ListItem button key="custom">
                            <ListItemText primary="Custom" />
                        </ListItem>
                    </List>
                </DialogContent>

                <DialogActions>
                    <Button autoFocus onClick={ props.onClose } color="primary">
                        Generate
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}