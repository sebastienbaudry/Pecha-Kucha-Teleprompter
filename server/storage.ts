import { type Presentation, type InsertPresentation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Presentations
  getPresentations(): Promise<Presentation[]>;
  getPresentation(id: string): Promise<Presentation | undefined>;
  createPresentation(presentation: InsertPresentation): Promise<Presentation>;
  updatePresentation(id: string, presentation: InsertPresentation): Promise<Presentation | undefined>;
  deletePresentation(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private presentations: Map<string, Presentation>;

  constructor() {
    this.presentations = new Map();
    this.seedData();
  }

  private seedData() {
    // Add sample presentation from the original HTML
    const samplePresentation: Presentation = {
      id: randomUUID(),
      title: "L'art et la morale - Exemple Pecha Kucha",
      slides: [
        "L'art et la morale ont toujours entretenu des relations conflictuelles. Aujourd'hui, ce vieux combat se réactualise brutalement : nous redécouvrons des chefs-d'œuvre à la lumière de scandales, de révélations ou d'archives qui ébranlent l'image des artistes. Une question éthique surgit alors : notre sens moral doit-il censurer notre plaisir esthétique ?",
        "Plus précisément, nous nous intéressons au lien qui unit le créateur à sa création. Dans une société qui exige de la transparence, les fautes de la vie privée d'un artiste – violences, racismes, crimes – viennent percuter notre appréciation de son travail. Le sujet de cet exposé est ce dilemme contemporain : que faire des œuvres 'coupables' ?",
        "Cela soulève une problématique centrale : Peut-on séparer l'œuvre de l'artiste ? L'acte artistique est-il autonome, flottant au-dessus de la réalité, ou demeure-t-il sali par la biographie de son auteur ? Doit-on trancher, comme dans le jugement de Salomon, en sacrifiant l'œuvre pour punir l'homme ?",
        "Pour répondre, nous suivrons un parcours en deux temps. D'abord, nous analyserons les arguments de ceux qui séparent l'homme de l'artiste pour sauver le patrimoine. Ensuite, nous verrons pourquoi cette séparation est devenue impossible pour le public, avant de conclure sur une troisième voie : la contextualisation.",
        "Premier argument : l'œuvre dépasse l'individu. Une fois achevée, la création s'émancipe de son auteur pour appartenir à l'Histoire. Comme devant cette toile abstraite, l'émotion esthétique ne dépend pas de la vie privée du peintre. Selon cette logique, l'œuvre possède une 'autonomie symbolique'. Vouloir la juger moralement, c'est confondre l'esthétique et le judiciaire.",
        "De plus, le génie artistique ne se corrèle pas à la vertu morale. L'histoire de l'art est remplie de créateurs aux comportements détestables qui ont pourtant produit du sublime. Si nous devions effacer toutes les œuvres créées par des hommes immoraux, nos musées et nos bibliothèques seraient vides. Il faut donc accepter ce paradoxe : un 'sale type' peut être un grand artiste.",
        "L'exemple incontournable en France est Louis-Ferdinand Céline. Auteur de pamphlets antisémites abjects, il a pourtant révolutionné la littérature avec Voyage au bout de la nuit. La position intellectuelle dominante consiste à dissocier le génie du style de l'idéologie de l'homme. On condamne le citoyen Céline, mais on continue d'étudier l'écrivain.",
        "Pourtant, cette séparation est parfois intellectuellement malhonnête. Souvent, l'œuvre porte la marque intime, voire les névroses de son auteur. Dans le cinéma d'auteur ou la musique, la fiction est le miroir de la réalité. Ignorer la biographie revient alors à se priver d'une clé de compréhension essentielle. L'art n'est pas un objet neutre, c'est une expression de soi.",
        "D'ailleurs, le public ne parvient pas toujours à faire la part des choses. Prenez le cas de Roman Polanski : aujourd'hui, on regarde ses films à travers le prisme des accusations qui le visent. Le contexte modifie la réception. Quand le scandale est trop bruyant, l'image de l'accusé se superpose à l'écran : la dissociation devient psychologiquement impossible pour le spectateur.",
        "Face à cela, la seule voie viable n'est ni la censure, ni le déni, mais la contextualisation. Il s'agit d'accompagner l'œuvre, comme le font certains musées, par des explications pédagogiques. On maintient l'accès à la culture, mais on éduque le regard. C'est une approche critique qui permet de préserver le patrimoine sans cautionner les actes.",
        "En bilan, la séparation totale entre l'œuvre et l'artiste est un idéal théorique qui résiste mal à la réalité. L'œuvre peut survivre au temps, mais elle reste cicatrisée par l'histoire de son auteur. Ce débat révèle la tension permanente entre notre désir de beauté intemporelle et notre besoin de justice immédiate.",
        "Personnellement, je défends une 'admiration lucide'. Je refuse de brûler les livres ou d'interdire les films, car l'art nous aide à penser. Mais je refuse l'aveuglement. On peut admirer le talent tout en condamnant fermement l'homme. C'est un équilibre difficile, une gymnastique intellectuelle nécessaire.",
        "Finalement, ce débat nous fait grandir. Il nous force à sortir de la passivité pour devenir des 'citoyens culturels'. L'avenir réside sans doute dans cette capacité à accepter la complexité du monde : aimer une œuvre ne signifie pas absoudre son créateur. C'est là que commence véritablement l'esprit critique."
      ],
    };
    this.presentations.set(samplePresentation.id, samplePresentation);
  }

  async getPresentations(): Promise<Presentation[]> {
    return Array.from(this.presentations.values());
  }

  async getPresentation(id: string): Promise<Presentation | undefined> {
    return this.presentations.get(id);
  }

  async createPresentation(insertPresentation: InsertPresentation): Promise<Presentation> {
    const id = randomUUID();
    const presentation: Presentation = { ...insertPresentation, id };
    this.presentations.set(id, presentation);
    return presentation;
  }

  async updatePresentation(
    id: string,
    insertPresentation: InsertPresentation
  ): Promise<Presentation | undefined> {
    const existing = this.presentations.get(id);
    if (!existing) return undefined;

    const updated: Presentation = { ...insertPresentation, id };
    this.presentations.set(id, updated);
    return updated;
  }

  async deletePresentation(id: string): Promise<boolean> {
    return this.presentations.delete(id);
  }
}

export const storage = new MemStorage();
