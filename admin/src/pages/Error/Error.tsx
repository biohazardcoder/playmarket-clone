import { Link } from "react-router-dom";

export const Error = () => {
  return (
    <section className="col-span-12 row-span-10 md:col-span-10 md:row-span-11 bg-theme h-screen">
      <div className="container h-full flex items-center justify-center flex-col gap-5">
        <h1 className="text-8xl text-config font-bold">
          <span className="text-mainly">4</span>0
          <span className="text-mainly">4</span>
        </h1>
        <p className="font-bold text-config">This is not the page you are looking for</p>
        <Link
          to={"/"}
          className="bg-config  py-2 px-5 font-bold rounded-3xl"
        >
          Go back
        </Link>
      </div>
    </section>
  );
};
