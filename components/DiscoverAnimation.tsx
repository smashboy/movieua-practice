import { Transition } from "@headlessui/react";

const DiscoverAnimation: React.FC<{ show: boolean }> = (props) => {
  const { show, children } = props;

  return (
    <Transition
      show={show}
      unmount={false}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      // leave="transition-opacity duration-150"
      // leaveFrom="opacity-100"
      // leaveTo="opacity-0"
    >
      {children}
    </Transition>
  );
};

export default DiscoverAnimation;
