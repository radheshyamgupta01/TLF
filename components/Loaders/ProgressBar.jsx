import NextTopLoader from "nextjs-toploader";

const ProgressBar = () => {
  return (
    <NextTopLoader
      color="#c40414"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="0 0 10px #FBBC05,0 0 5px #FBBC05"
      //   template={`
      //   <div class="h-3 w-full z-50">
      //     <div class="bar" role="bar"><div class="peg"></div></div>
      //     <div class="spinner bg-white p-2 m-2 rounded" role="spinner bg"><div class="spinner-icon"></div></div>
      //   </div>
      // `}
      zIndex={1600}
      showAtBottom={false}
    />
  );
};

export default ProgressBar;
