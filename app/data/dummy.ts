export const dummyForms = [
  {
    id: "alpha",
    title: "Survey Pengembangan SIG",
    description: "Kumpulkan feedback untuk pengembangan program.",
    updatedAt: "2 hari lalu",
    questions: [
      { id: 1, type: "SHORT_ANSWER", title: "Nama lengkap", required: true },
      { id: 2, type: "DROPDOWN", title: "Semester", required: true },
      { id: 3, type: "CHECKBOX", title: "Minat utama", required: false },
      {
        id: 4,
        type: "MULTIPLE_CHOICE",
        title: "Ekspektasi belajar",
        required: true,
      },
    ],
  },
  {
    id: "beta",
    title: "Pendaftaran Volunteer",
    description: "Form pendaftaran volunteer acara kampus.",
    updatedAt: "1 minggu lalu",
    questions: [
      { id: 5, type: "SHORT_ANSWER", title: "Nama panggilan", required: true },
      { id: 6, type: "DROPDOWN", title: "Divisi pilihan", required: true },
      { id: 7, type: "LONG_ANSWER", title: "Pengalaman", required: true },
      { id: 8, type: "SHORT_ANSWER", title: "Kontak", required: true },
    ],
  },
  {
    id: "gamma",
    title: "Evaluasi Workshop",
    description: "Masukan peserta untuk sesi workshop.",
    updatedAt: "5 jam lalu",
    questions: [
      { id: 9, type: "SHORT_ANSWER", title: "Materi favorit", required: true },
      { id: 10, type: "RATING", title: "Rating", required: true },
      {
        id: 11,
        type: "LONG_ANSWER",
        title: "Saran perbaikan",
        required: false,
      },
    ],
  },
];
