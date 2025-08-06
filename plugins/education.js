// plugins/education.js
const educationData = {
  // විශයන් සහ ඒවායේ දත්ත
  subjects: {
    "sinhala": {
      name: "සිංහල භාෂාව හා සාහිත්‍ය",
      papers: [
        { year: "2022", url: "https://pastpapers.wiki/sinhala-2022.pdf" },
        { year: "2021", url: "https://pastpapers.wiki/sinhala-2021.pdf" }
      ],
      questions: [
        {
          question: "මහාකාව්‍ය සංග්‍රහයේ කතුවරයා කවුද?",
          options: ["ගුණදාස අමරසේන", "කුමාරතුංග", "මුදියන්සේ අල්ලප්පෙරුම"],
          answer: "ගුණදාස අමරසේන"
        }
      ],
      notes: [
        "සිංහල ව්‍යාකරණ මූලිකාංග: නාම පද, ක්‍රියා පද, විශේෂණ",
        "සන්ධි වර්ග: ස්වර සන්ධි, ව්‍යඤ්ජන සන්ධි"
      ]
    },
    "maths": {
      name: "ගණිතය",
      papers: [
        { year: "2022", url: "https://pastpapers.wiki/maths-2022.pdf" }
      ],
      questions: [
        {
          question: "(a + b)² = ?",
          options: ["a² + b²", "a² + 2ab + b²", "a² - b²"],
          answer: "a² + 2ab + b²"
        }
      ],
      notes: [
        "චතුරස්‍ර සමීකරණ: ax² + bx + c = 0",
        "ත්‍රිකෝණමිතිය: sin, cos, tan"
      ]
    }
    // අනෙකුත් විශයන් එකතු කරන්න...
  }
};

module.exports = educationData;
