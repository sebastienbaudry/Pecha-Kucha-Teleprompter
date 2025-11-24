import * as dotenv from "dotenv";
dotenv.config();

const API_URL = process.env.API_URL || "http://localhost:5000";

const presentation = {
    title: "FICHE TECHNIQUE : PECHA KUCHA C1 (Version Longue)",
    slides: [
        {
        },
        {
            title: "DIAPO 4 : LE PLAN",
            content: "Visuel : L'École d'Athènes (Raphaël).\n\nScript : « Pour répondre à cette question complexe, nous organiserons notre réflexion comme Raphaël a structuré les savoirs dans cette fresque du Vatican. Dans un premier temps, nous analyserons les arguments classiques de ceux qui séparent l'homme de l'artiste au nom de l'universalité du Beau. Ensuite, nous verrons pourquoi cette séparation théorique est devenue psychologiquement impossible pour la sensibilité moderne. Enfin, nous conclurons sur une troisième voie nécessaire : celle de la contextualisation, seule approche capable de réconcilier l'esthétique et l'éthique. »",
            duration: 35
        },
        {
            title: "DIAPO 5 : LE CONCEPT",
            content: "Visuel : Composition Rouge/Jaune/Bleu (Piet Mondrian).\n\nScript : « Premier argument majeur : l'œuvre dépasse l'individu. Il existe une théorie selon laquelle, une fois achevée, la création s'émancipe radicalement de son auteur pour appartenir à l'Histoire. Regardez cette composition de Mondrian : c'est une recherche d'harmonie universelle, faite de lignes et de couleurs pures. L'émotion qu'elle procure ne dépend aucunement de la vie privée du peintre. Selon cette logique de l'autonomie symbolique, vouloir juger une toile avec des critères moraux serait une erreur de catégorie, revenant à confondre l'équilibre géométrique avec le code pénal. »",
            duration: 35
        },
        {
        },
        {
            title: "DIAPO 9 : L'EXEMPLE CONTEMPORAIN (HISTORIQUE)",
            content: "Visuel : Suzanne et les Vieillards (Artemisia Gentileschi).\n\nScript : « Pire encore, dissocier l'œuvre de la vie peut nous aveugler sur le sens réel d'un tableau. Regardez attentivement cette Suzanne d'Artemisia Gentileschi. Contrairement aux versions masculines érotisées, elle peint ici le dégoût et la peur. On ne peut comprendre la vérité de ce regard que si l'on sait que la peintre a elle-même été violée par son maître. Ici, la biographie ne salit pas l'œuvre : elle l'éclaire tragiquement. La dissociation devient impossible, car la peinture est le cri direct de la victime transformé en art. »",
            duration: 35
        },
        {
            title: "DIAPO 10 : LA SOLUTION",
            content: "Visuel : Le Philosophe en méditation (Rembrandt).\n\nScript : « Face à cette impasse, la seule voie viable n'est ni la censure radicale, ni le déni aveugle, mais la contextualisation. Comme ce philosophe de Rembrandt, assis au pied de l'escalier en spirale symbolisant la réflexion, nous devons prendre de la hauteur. Il s'agit d'accompagner l'œuvre par des explications pédagogiques claires dans les musées. On maintient l'accès à la culture, mais on éduque le regard du spectateur. C'est une approche critique exigeante qui permet de préserver le patrimoine tout en nommant les zones d'ombre. »",
            duration: 35
        },
        {
        }
    ]
};

async function seedPresentation() {
    try {
        console.log(`Creating presentation: ${presentation.title}`);

        const response = await fetch(`${API_URL}/api/presentations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(presentation),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to create presentation: ${error}`);
        }

        const result = await response.json();
        console.log("✅ Presentation created successfully!");
        console.log(`ID: ${result.id}`);
        console.log(`Slides: ${result.slides.length}`);

    } catch (error) {
        console.error("❌ Error seeding presentation:", error);
        process.exit(1);
    }
}

seedPresentation();
