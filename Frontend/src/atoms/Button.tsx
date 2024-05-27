import { Button, ButtonToolbar } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

interface ButtonProps {
  onClick: () => void;
}

const Buttons: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <Button
      onClick={onClick}
      appearance="primary"    >
      {children}
    </Button>
  );
};

export default Buttons;
