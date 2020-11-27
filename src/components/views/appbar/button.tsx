import MuiButton from '@material-ui/core/Button';
import MuiIconButton from '@material-ui/core/IconButton';
import { experimentalStyled as styled } from '@material-ui/core/styles';

export const Button = styled(MuiButton)(({theme}) => ({

}));

export const IconButton = styled(MuiIconButton)(({theme}) => ({
    '&.MuiIconButton-root': {
        borderRadius: 0
    }
}));

export default Button;