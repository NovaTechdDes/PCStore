interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalModificarProducto = ({ isOpen, onClose }: Props) => {
  console.log(isOpen, onClose);
  return <div>ModalModificarProducto</div>;
};
