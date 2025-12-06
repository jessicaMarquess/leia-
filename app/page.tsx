"use client";

import { signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaSpotify,
  FaStar,
  FaWhatsapp,
} from "react-icons/fa";
import {
  FiBookmark,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiEdit2,
  FiLogOut,
  FiMail,
  FiPlus,
  FiX,
} from "react-icons/fi";
import { IoBookOutline } from "react-icons/io5";

interface Book {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  author: string;
  genre: string;
  status: "COMPLETADO" | "LENDO" | "PLANEJADO";
  rating: number;
  notes: string;
}

const initialBooks: Book[] = [
  {
    id: 1,
    startDate: "14/01/2024",
    endDate: "19/01/2024",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    status: "COMPLETADO",
    rating: 9,
    notes:
      "Uma obra-prima sobre a perseguição do sonho americano. Fitzgerald retrata brilhantemente a Era do Jazz.",
  },
  {
    id: 2,
    startDate: "31/12/2023",
    endDate: "24/01/2024",
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    status: "LENDO",
    rating: 10,
    notes:
      "Um clássico distópico que faz refletir sobre vigilância e controle. Muito relevante nos dias de hoje.",
  },
  {
    id: 3,
    startDate: "14/02/2024",
    endDate: "27/02/2024",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    status: "COMPLETADO",
    rating: 8,
    notes:
      "História poderosa sobre justiça e preconceito. Personagens memoráveis e lições atemporais.",
  },
  {
    id: 4,
    startDate: "31/01/2024",
    endDate: "13/02/2024",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    status: "COMPLETADO",
    rating: 9,
    notes:
      "Uma verdadeira joia da literatura. Elizabeth Bennet é um personagem admirável e independente.",
  },
  {
    id: 5,
    startDate: "29/02/2024",
    endDate: "09/03/2024",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Fiction",
    status: "COMPLETADO",
    rating: 7,
    notes:
      "Voz narrativa única e intensa. Holden Caulfield é um protagonista complexo e controverso.",
  },
  {
    id: 6,
    startDate: "10/03/2024",
    endDate: "18/03/2024",
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    genre: "Romance",
    status: "COMPLETADO",
    rating: 9,
    notes:
      "Uma história apaixonante de amor e independência. Jane é uma heroína forte e determinada.",
  },
  {
    id: 7,
    startDate: "19/03/2024",
    endDate: "28/03/2024",
    title: "Wuthering Heights",
    author: "Emily Brontë",
    genre: "Gothic",
    status: "COMPLETADO",
    rating: 8,
    notes:
      "Paixão e obsessão no cenário das terras altas. Uma narrativa complexa e envolvente.",
  },
  {
    id: 8,
    startDate: "29/03/2024",
    endDate: "06/04/2024",
    title: "The Great Expectations",
    author: "Charles Dickens",
    genre: "Fiction",
    status: "LENDO",
    rating: 8,
    notes:
      "Uma épica vitorianos sobre ambição e redenção. Pip é um personagem em constante evolução.",
  },
  {
    id: 9,
    startDate: "07/04/2024",
    endDate: "15/04/2024",
    title: "Moby Dick",
    author: "Herman Melville",
    genre: "Adventure",
    status: "COMPLETADO",
    rating: 7,
    notes:
      "Uma aventura épica no mar. A obsessão do Capitão Ahab é fascinante e trágica.",
  },
  {
    id: 10,
    startDate: "16/04/2024",
    endDate: "24/04/2024",
    title: "The Odyssey",
    author: "Homer",
    genre: "Epic",
    status: "PLANEJADO",
    rating: 0,
    notes:
      "Uma das maiores aventuras da literatura. A jornada de Ulisses é épica e inspiradora.",
  },
  {
    id: 11,
    startDate: "25/04/2024",
    endDate: "03/05/2024",
    title: "Frankenstein",
    author: "Mary Shelley",
    genre: "Horror",
    status: "COMPLETADO",
    rating: 8,
    notes:
      "Uma reflexão profunda sobre criação, responsabilidade e humanidade. Surpreendentemente moderno.",
  },
  {
    id: 12,
    startDate: "04/05/2024",
    endDate: "12/05/2024",
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    genre: "Fantasy",
    status: "PLANEJADO",
    rating: 0,
    notes:
      "Uma exploração da vaidade e corrupção moral. Wilde entrega sua prosa elegante e perspicaz.",
  },
];

const monthRanking = [
  { position: 2, month: "02/24", books: 2 },
  { position: 1, month: "01/24", books: 3 },
  { position: 3, month: "03/24", books: 1 },
];

export default function Home() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [user, setUser] = useState<{
    id: number;
    name: string;
    email: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedBookId, setExpandedBookId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    author: string;
    genre: string;
    startDate: string;
    endDate: string;
    status: "COMPLETADO" | "LENDO" | "PLANEJADO";
    rating: number;
    notes: string;
  }>({
    title: "",
    author: "",
    genre: "",
    startDate: "",
    endDate: "",
    status: "PLANEJADO",
    rating: 5,
    notes: "",
  });

  // Load books from API on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/books", { cache: "no-store" });
        if (!res.ok) return; // keep initial fallback silently
        const data: Book[] = await res.json();
        if (Array.isArray(data)) setBooks(data);
      } catch (e) {
        console.error("Failed to load books", e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.authenticated)
          setUser({ id: data.id, name: data.name, email: data.email });
      } catch {}
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const totalBooks = books.length;
  const completed = books.filter((b) => b.status === "COMPLETADO").length;
  const reading = books.filter((b) => b.status === "LENDO").length;
  const wantToRead = books.filter((b) => b.status === "PLANEJADO").length;

  const itemsPerPage = 5;
  const totalPages = Math.ceil(books.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBooks = books.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setExpandedBookId(null);
  };

  const convertDateToCompare = (dateStr: string): string => {
    if (!dateStr) return "";

    // Already in yyyy-MM-dd format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }

    // Convert dd/mm/yyyy to yyyy-MM-dd for comparison
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month}-${day}`;
    }

    return dateStr;
  };

  const brToIso = (dateStr: string): string => {
    if (!dateStr) return "";
    const [d, m, y] = dateStr.split("/");
    if (d && m && y) return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    return dateStr;
  };

  const isoToBr = (iso: string): string => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    if (y && m && d) return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
    return iso;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) errors.title = "Título é obrigatório";
    if (!formData.author.trim()) errors.author = "Autor é obrigatório";
    if (!formData.genre.trim()) errors.genre = "Gênero é obrigatório";
    if (!formData.startDate) errors.startDate = "Data de início é obrigatória";
    if (!formData.endDate) errors.endDate = "Data de fim é obrigatória";
    if (
      formData.startDate &&
      formData.endDate &&
      convertDateToCompare(formData.startDate) >
        convertDateToCompare(formData.endDate)
    ) {
      errors.endDate = "Data de fim deve ser após data de início";
    }
    if (!formData.notes.trim())
      errors.notes = "Notas/pensamentos são obrigatórios";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenEditModal = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      startDate: brToIso(book.startDate),
      endDate: brToIso(book.endDate),
      status: book.status,
      rating: book.rating,
      notes: book.notes,
    });
    setIsModalOpen(true);
    setFormErrors({});
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
    setFormData({
      title: "",
      author: "",
      genre: "",
      startDate: "",
      endDate: "",
      status: "PLANEJADO",
      rating: 5,
      notes: "",
    });
    setFormErrors({});
  };

  const handleSaveBook = async () => {
    if (!validateForm()) return;

    if (editingBook) {
      try {
        const res = await fetch(`/api/books/${editingBook.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            author: formData.author,
            genre: formData.genre,
            startDate: isoToBr(formData.startDate),
            endDate: isoToBr(formData.endDate),
            status: formData.status,
            rating: formData.rating,
            notes: formData.notes,
          }),
        });
        if (!res.ok) throw new Error("Falha ao atualizar livro");
        const updated: Book = await res.json();
        setBooks(books.map((b) => (b.id === updated.id ? updated : b)));
      } catch (e) {
        console.error(e);
        return;
      }
    } else {
      try {
        const res = await fetch(`/api/books`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            author: formData.author,
            genre: formData.genre,
            startDate: isoToBr(formData.startDate),
            endDate: isoToBr(formData.endDate),
            status: formData.status,
            rating: formData.rating,
            notes: formData.notes,
          }),
        });
        if (!res.ok) throw new Error("Falha ao criar livro");
        const created: Book = await res.json();
        setBooks([...books, created]);
      } catch (e) {
        console.error(e);
        return;
      }
    }

    handleCloseModal();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white font-sans">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between pb-6 mb-12 border-b border-zinc-700">
          <h1 className="text-4xl font-bold flex items-center gap-3 font-bitcount">
            <IoBookOutline className="text-pink-500" size={36} />
            leia+
          </h1>
          <div className="flex items-center gap-3">
            {user && <span className="text-sm text-zinc-300">{user.name}</span>}
            <button
              onClick={handleLogout}
              className="p-2 bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-pink-500/50"
            >
              <FiLogOut size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-1 h-full">
            <LevelCard level={3} xp={465} />
          </div>

          <div className="lg:col-span-2 h-full">
            <MonthRanking ranking={monthRanking} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 font-bitcount text-pink-500">
          <StatCard
            icon={IoBookOutline}
            label="TOTAL DE LIVROS"
            value={totalBooks}
          />
          <StatCard icon={FiCheckCircle} label="CONCLUIDOS" value={completed} />
          <StatCard icon={FiClock} label="LENDO AGORA" value={reading} />
          <StatCard icon={FiBookmark} label="QUER LER" value={wantToRead} />
        </div>

        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center p-2 bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-pink-500/50"
          >
            <FiPlus size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <BooksTable
            books={paginatedBooks}
            expandedBookId={expandedBookId}
            setExpandedBookId={setExpandedBookId}
            onEditBook={handleOpenEditModal}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 py-2 md:px-4 bg-pink-500 hover:bg-pink-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition"
              >
                <span className="text-lg">←</span>
                <span className="hidden md:inline md:ml-2">Anterior</span>
              </button>
              <span className="text-white text-sm md:text-base">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 py-2 md:px-4 bg-pink-500 hover:bg-pink-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition"
              >
                <span className="text-lg">→</span>
                <span className="hidden md:inline md:ml-2">Próximo</span>
              </button>
            </div>
          )}
        </div>
      </main>

      <footer
        className="mt-20 border-t border-zinc-700"
        suppressHydrationWarning
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bitcount text-white">
                Jessica Marques
              </p>
              <span className="text-lg text-purple-400">💜</span>
            </div>

            <div className="flex items-center gap-5">
              <a
                href="https://github.com/jessicaMarquess"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-pink-500 transition-colors"
                title="GitHub"
              >
                <FaGithub size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/jessica-maria-marques"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-pink-500 transition-colors"
                title="LinkedIn"
              >
                <FaLinkedinIn size={18} />
              </a>
              <a
                href="https://open.spotify.com/user/pthm6sw6nupko1l1x8emhccfm?si=4663796ff88c4426"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-pink-500 transition-colors"
                title="Spotify"
              >
                <FaSpotify size={18} />
              </a>
              <a
                href="https://www.instagram.com/jessicamarques.css/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-pink-500 transition-colors"
                title="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="mailto:jessica.marques.dev@gmail.com"
                className="text-zinc-400 hover:text-pink-500 transition-colors"
                title="Email"
              >
                <FiMail size={18} />
              </a>
              <a
                href="https://wa.me/5588993096220"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-pink-500 transition-colors"
                title="WhatsApp"
              >
                <FaWhatsapp size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {isModalOpen && (
        <AddBookModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSaveBook}
          formData={formData}
          formErrors={formErrors}
          onInputChange={handleInputChange}
          isEditing={editingBook !== null}
        />
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: number;
}

function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
      <p className="text-pink-300 text-sm font-semibold mb-2">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

interface LevelCardProps {
  level: number;
  xp: number;
}

function LevelCard({ level, xp }: LevelCardProps) {
  return (
    <div className="bg-linear-to-br from-purple-950 via-purple-900 to-purple-800 rounded-2xl p-8 border-2 border-pink-500 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-linear-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl">⭐</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold tracking-wide">
              SEU NÍVEL
            </p>
            <p className="text-5xl font-bold text-white font-bitcount">
              {level}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white text-2xl font-bold">{xp} XP</p>
          <p className="text-purple-300 text-xs mt-1">
            165 / 300 para próximo nível
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="w-full bg-purple-950 rounded-full h-3 border border-purple-800">
          <div
            className="bg-linear-to-r from-pink-500 to-pink-400 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(165 / 300) * 100}%` }}
          />
        </div>
      </div>

      <p className="text-purple-300 text-sm leading-relaxed">
        Ganhe XP completando livros! +50 XP por livro, +5 XP por ponto de nota.
      </p>
    </div>
  );
}

interface MonthRankingEntry {
  position: number;
  month: string;
  books: number;
}

interface MonthRankingProps {
  ranking: MonthRankingEntry[];
}

function MonthRanking({ ranking }: MonthRankingProps) {
  const getMedalEmoji = (position: number) => {
    const medals = { 1: "🥇", 2: "🥈", 3: "🥉" };
    return medals[position as keyof typeof medals];
  };

  const renderRankingCard = (entry: MonthRankingEntry) => {
    const borderColor =
      entry.position === 1
        ? "border-yellow-500"
        : entry.position === 2
        ? "border-gray-400"
        : "border-orange-500";

    const bgColor =
      entry.position === 1
        ? "bg-yellow-900"
        : entry.position === 2
        ? "bg-gray-700"
        : "bg-orange-900";

    const desktopHeight =
      entry.position === 1
        ? "lg:h-48"
        : entry.position === 2
        ? "lg:h-40"
        : "lg:h-32";

    return (
      <div
        key={entry.position}
        className={`${bgColor} ${borderColor} ${desktopHeight} rounded-2xl border-2 p-4 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 lg:gap-0 w-full lg:w-auto lg:min-w-40`}
      >
        <div className="flex items-center gap-3 lg:gap-0 lg:flex-col">
          <p className="text-3xl lg:text-2xl">
            {getMedalEmoji(entry.position)}
          </p>
          <p className="text-2xl lg:text-3xl font-bold font-bitcount text-white leading-none">
            #{entry.position}
          </p>
        </div>
        <div className="text-right lg:text-center lg:mt-1">
          <p className="text-xs text-zinc-300">{entry.month}</p>
          <p className="text-sm font-semibold text-white">{entry.books}L</p>
        </div>
      </div>
    );
  };

  const getDesktopOrder = () => {
    const orderMap = { 2: 0, 1: 1, 3: 2 };
    return [...ranking].sort(
      (a, b) =>
        orderMap[a.position as keyof typeof orderMap] -
        orderMap[b.position as keyof typeof orderMap]
    );
  };

  const getMobileOrder = () => {
    return [...ranking].sort((a, b) => a.position - b.position);
  };

  return (
    <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 h-full flex flex-col">
      <h2 className="text-xl font-bold font-bitcount text-pink-400 mb-8">
        Ranking de Meses
      </h2>

      {/* Mobile View */}
      <div className="flex lg:hidden gap-3 flex-col flex-1">
        {getMobileOrder().map(renderRankingCard)}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex items-end justify-center gap-6 flex-1">
        {getDesktopOrder().map(renderRankingCard)}
      </div>
    </div>
  );
}

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: {
    title: string;
    author: string;
    genre: string;
    startDate: string;
    endDate: string;
    status: "COMPLETADO" | "LENDO" | "PLANEJADO";
    rating: number;
    notes: string;
  };
  formErrors: Record<string, string>;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  isEditing?: boolean;
}

function AddBookModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  formErrors,
  onInputChange,
  isEditing = false,
}: AddBookModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-800 rounded-lg border border-zinc-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-zinc-800 border-b border-zinc-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {isEditing ? "Editar Livro" : "Adicionar Novo Livro"}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Título"
              name="title"
              type="text"
              value={formData.title}
              onChange={onInputChange}
              error={formErrors.title}
              placeholder="Ex: The Great Gatsby"
            />
            <FormField
              label="Autor"
              name="author"
              type="text"
              value={formData.author}
              onChange={onInputChange}
              error={formErrors.author}
              placeholder="Ex: F. Scott Fitzgerald"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Gênero"
              name="genre"
              type="text"
              value={formData.genre}
              onChange={onInputChange}
              error={formErrors.genre}
              placeholder="Ex: Fiction"
            />
            <div>
              <label className="block text-sm font-semibold text-pink-400 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={onInputChange}
                className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-pink-500 transition"
              >
                <option value="PLANEJADO">Planejado</option>
                <option value="LENDO">Lendo</option>
                <option value="COMPLETADO">Completado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Data de Início (dd/mm/yyyy)"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={onInputChange}
              error={formErrors.startDate}
              placeholder="dd/mm/yyyy"
            />
            <FormField
              label="Data de Fim (dd/mm/yyyy)"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={onInputChange}
              error={formErrors.endDate}
              placeholder="dd/mm/yyyy"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-pink-400 mb-2">
              Nota: {formData.rating} / 10
            </label>
            <input
              type="range"
              name="rating"
              min="0"
              max="10"
              value={formData.rating}
              onChange={onInputChange}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
              style={{
                background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${
                  (formData.rating / 10) * 100
                }%, #3f3f46 ${(formData.rating / 10) * 100}%, #3f3f46 100%)`,
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-pink-400 mb-2">
              Notas e Pensamentos
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={onInputChange}
              placeholder="Compartilhe seus pensamentos e impressões sobre o livro..."
              className={`w-full px-4 py-2 bg-zinc-700 border rounded-lg text-white focus:outline-none transition resize-none ${
                formErrors.notes
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-600 focus:border-pink-500"
              }`}
              rows={4}
            />
            {formErrors.notes && (
              <p className="text-red-400 text-sm mt-1">{formErrors.notes}</p>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-zinc-800 border-t border-zinc-700 p-6 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 px-4 py-2 bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-lg transition"
          >
            {isEditing ? "Salvar Alterações" : "Adicionar Livro"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
}

function FormField({
  label,
  name,
  type,
  value,
  onChange,
  error,
  placeholder,
}: FormFieldProps) {
  const convertDateForInput = (dateStr: string) => {
    if (!dateStr) return "";
    if (type !== "date") return dateStr;

    // Check if already in yyyy-MM-dd format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }

    // Convert dd/mm/yyyy to yyyy-MM-dd
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month}-${day}`;
    }

    // Return as-is if format is unexpected
    return dateStr;
  };

  const convertDateFromInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Let the native date value (yyyy-MM-dd) flow to state directly.
    onChange(e);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-pink-400 mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={type === "date" ? convertDateForInput(String(value)) : value}
        onChange={convertDateFromInput}
        placeholder={placeholder}
        className={`w-full px-4 py-2 bg-zinc-700 border rounded-lg text-white focus:outline-none transition ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-zinc-600 focus:border-pink-500"
        } ${type === "date" ? "scheme-dark" : ""}`}
        style={type === "date" ? { colorScheme: "dark" } : undefined}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

interface BooksTableProps {
  books: Book[];
  expandedBookId: number | null;
  setExpandedBookId: (id: number | null) => void;
  onEditBook: (book: Book) => void;
}

function BooksTable({
  books,
  expandedBookId,
  setExpandedBookId,
  onEditBook,
}: BooksTableProps) {
  const toggleExpand = (id: number) => {
    setExpandedBookId(expandedBookId === id ? null : id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETADO":
        return "bg-green-900 text-green-200";
      case "LENDO":
        return "bg-purple-900 text-purple-200";
      case "PLANEJADO":
        return "bg-red-900 text-red-200";
      default:
        return "bg-zinc-700 text-zinc-200";
    }
  };

  return (
    <>
      <div className="block md:hidden space-y-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm">
                    {book.title}
                  </h3>
                  <p className="text-xs text-zinc-400">{book.author}</p>
                </div>
                <button
                  onClick={() => toggleExpand(book.id)}
                  className="text-pink-400 hover:text-pink-300 transition shrink-0 mt-1"
                >
                  <span className="text-xs font-semibold">
                    {expandedBookId === book.id ? "Ver menos" : "Ver mais"}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-zinc-400">Data Início</p>
                  <p className="text-white">{book.startDate}</p>
                </div>
                <div>
                  <p className="text-zinc-400">Data Fim</p>
                  <p className="text-white">{book.endDate}</p>
                </div>
                <div>
                  <p className="text-zinc-400">Gênero</p>
                  <p className="text-white">{book.genre}</p>
                </div>
                <div>
                  <p className="text-zinc-400">Nota</p>
                  <div className="flex items-center gap-1 text-white">
                    {book.rating}
                    <FaStar className="text-yellow-500" size={12} />
                  </div>
                </div>
              </div>

              <div>
                <span
                  className={`${getStatusColor(
                    book.status
                  )} px-3 py-1 rounded-full text-xs font-semibold inline-block`}
                >
                  {book.status}
                </span>
              </div>

              {expandedBookId === book.id && (
                <div className="block md:hidden border-t border-zinc-700 pt-4 mt-4">
                  <h4 className="text-xs font-semibold text-pink-400 mb-2">
                    Notas e Pensamentos
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {book.notes}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => onEditBook(book)}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white transition flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm"
                >
                  <FiEdit2 size={16} />
                  <span>Editar</span>
                </button>
              </div>
            </div>

            {expandedBookId === book.id && (
              <div className="hidden md:block bg-zinc-700 bg-opacity-50 px-4 py-3 border-t border-zinc-700">
                <h4 className="text-xs font-semibold text-pink-400 mb-2">
                  Notas e Pensamentos
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {book.notes}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* DESKTOP VIEW - Table */}
      <div className="hidden md:block bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-700 font-bitcount">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-pink-400">
                  DATA INÍCIO
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-pink-400">
                  DATA FIM
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-pink-400">
                  TÍTULO & AUTOR
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-pink-400">
                  GÊNERO
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-pink-400">
                  STATUS
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-pink-400">
                  NOTA
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-pink-400">
                  AÇÃO
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <React.Fragment key={book.id}>
                  <tr
                    className={`${
                      index > 0 ? "border-t border-zinc-700" : ""
                    } hover:bg-zinc-700 transition`}
                  >
                    <td className="px-6 py-4 text-sm text-zinc-300">
                      {book.startDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">
                      {book.endDate}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">{book.title}</p>
                      <p className="text-sm text-zinc-400">{book.author}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">
                      {book.genre}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`${getStatusColor(
                          book.status
                        )} px-3 py-1 rounded-full text-xs font-semibold`}
                      >
                        {book.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-1">
                        {book.rating}
                        <FaStar className="text-yellow-500" size={14} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onEditBook(book)}
                          className="text-pink-500 hover:text-pink-400 transition"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => toggleExpand(book.id)}
                          className="text-pink-400 hover:text-pink-300 transition"
                        >
                          <FiChevronDown
                            size={18}
                            className={`transform transition-transform ${
                              expandedBookId === book.id ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedBookId === book.id && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 pt-0">
                        <div className="space-y-2 border-t border-zinc-700 pt-4">
                          <h3 className="text-sm font-semibold text-pink-400 mb-2">
                            Notas e Pensamentos
                          </h3>
                          <p className="text-sm text-zinc-300 leading-relaxed">
                            {book.notes}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
