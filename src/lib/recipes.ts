export type Recipe = {
  id: string;
  title: string;
  theme: string;
  emoji: string;
  difficulty: "Easy" | "Medium" | "Hard";
  time: string;
  ingredients: string[];
  steps: { title: string; detail: string; learn: string }[];
  topics: string[];
};

export const RECIPES: Recipe[] = [
  {
    id: "rainbow-pancakes",
    title: "Rainbow Fraction Pancakes",
    theme: "Fractions & Color Science",
    emoji: "🥞",
    difficulty: "Easy",
    time: "25 min",
    ingredients: ["1 cup flour", "1 cup milk", "1 egg", "2 tbsp sugar", "Natural food coloring"],
    topics: ["Fractions", "Color mixing", "Heat transfer"],
    steps: [
      { title: "Measure ingredients", detail: "Combine 1 cup flour with ½ cup milk.", learn: "1 + ½ = 3⁄2 cups total." },
      { title: "Mix the batter", detail: "Whisk until smooth — about 2 minutes.", learn: "Whisking adds air bubbles → fluffy pancakes." },
      { title: "Color it up", detail: "Split batter into 4 bowls, add colors.", learn: "Red + Blue = Purple. Try it!" },
      { title: "Cook on medium heat", detail: "Pour ¼ cup per pancake.", learn: "Heat denatures proteins and sets the shape." },
    ],
  },
  {
    id: "volcano-cupcakes",
    title: "Volcano Lava Cupcakes",
    theme: "Chemical Reactions",
    emoji: "🌋",
    difficulty: "Medium",
    time: "40 min",
    ingredients: ["Chocolate batter", "Baking soda", "Vinegar drops", "Red frosting"],
    topics: ["Acid + base reaction", "States of matter"],
    steps: [
      { title: "Make the crater", detail: "Bake cupcakes and hollow the centers.", learn: "Baking soda releases CO₂ → rise!" },
      { title: "Trigger the eruption", detail: "Add vinegar drops to baking soda.", learn: "Acid + base = bubbly gas." },
      { title: "Top with lava", detail: "Pipe red frosting overflowing.", learn: "Liquids flow due to gravity." },
    ],
  },
  {
    id: "geometry-pizza",
    title: "Geometry Pizza",
    theme: "Shapes & Symmetry",
    emoji: "🍕",
    difficulty: "Easy",
    time: "30 min",
    ingredients: ["Pizza dough", "Tomato sauce", "Cheese", "Veggies in shapes"],
    topics: ["Geometry", "Angles", "Symmetry"],
    steps: [
      { title: "Roll a circle", detail: "Stretch dough into a circle.", learn: "Diameter × π = circumference." },
      { title: "Slice into 8", detail: "Each slice = 45°.", learn: "360° ÷ 8 = 45° per slice." },
      { title: "Decorate symmetrically", detail: "Mirror toppings across the center.", learn: "That's reflective symmetry!" },
    ],
  },
  {
    id: "galaxy-smoothie",
    title: "Galaxy Density Smoothie",
    theme: "Density & Layers",
    emoji: "🌌",
    difficulty: "Medium",
    time: "15 min",
    ingredients: ["Blueberries", "Yogurt", "Honey", "Coconut milk"],
    topics: ["Density", "Liquids", "Solubility"],
    steps: [
      { title: "Layer slowly", detail: "Pour heaviest first (yogurt).", learn: "Density = mass ÷ volume." },
      { title: "Float lighter layer", detail: "Coconut milk on top.", learn: "Less dense liquids float." },
      { title: "Top with stars", detail: "Sprinkle berries.", learn: "Surface tension holds them up briefly." },
    ],
  },
];