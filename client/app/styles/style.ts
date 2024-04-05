export const styles = {
  title:
    "text-[25px] text-black dark:text-white font-[500] font-Poopins text-center py-2",
  label: "text-[16px] font-Poppins text-black dark:text-white",
  input:
    "w-full text-black dark:text-white bg-transparent border rounded-h-[40px] px-2 outline-none mt-[10px] font-Poppins rounded-md",
  button:
    "flex flex-row justify-center items-center py-3 px-6 rounded-full cursor-pointer bg-[#2190ff] min-h-[45px] w-full text-[16px] font-Poppins font-semibold",
  shake: `
    @keyframes shake {
      0% {
        transform: translateX(0);
      }
      25% {
        transform: translateX(-5px);
      }
      50% {
        transform: translateX(5px);
      }
      75% {
        transform: translateX(-5px);
      }
      100% {
        transform: translateX(0);
      }
    }
    animation: shake 0.5s;
  `,
};
