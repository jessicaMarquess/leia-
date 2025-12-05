import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-r/hsl from-black to-gray-900 font-sans">
      <main className="flex max-w-3xl">
        <div className="flex flex-col items-center justify-center gap-4 border-2 border-pink-500 size-full rounded-3xl bg-gray-170 p-12">
          <div className="rounded-full bg-pink-500 size-20 flex items-center justify-center">
            <IoBookOutline className="text-white text-4xl" />
          </div>
          <h1 className="font-bitcount text-white text-4xl font-bold">LEIA+</h1>
          <h2 className="text-pink-400 text-[1.125rem] font-sans">
            Organize sua jornada de leitura
          </h2>
          <Link
            className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition flex items-center gap-2 cursor-pointer mt-2"
            href="/"
          >
            <FaGoogle />
            Entrar com o Google
          </Link>
        </div>
      </main>
    </div>
  );
}
