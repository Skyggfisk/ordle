type BackspaceKeyProps = {
  onClick: () => void;
};

export const BackspaceKey = ({ onClick }: BackspaceKeyProps) => {
  return (
    <button
      className="max-w-[4rem] min-w-[2.5rem] flex-1 cursor-pointer rounded bg-purple-300 px-2 py-2 text-base font-bold text-black shadow transition-colors duration-150 hover:bg-purple-400 sm:px-4 sm:py-2"
      onClick={onClick}
      type="button"
    >
      ⌫
    </button>
  );
};
