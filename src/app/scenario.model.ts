export class Scenario {
  title: string;
  duration: string;
  eduProg: string;
  //----------page2

  BloomTaxonomy: string;
  knowledgeGoalsCheck: boolean;
  knowledgeGoals: string;
  skillGoalsCheck: boolean;
  skillGoals: string;
  behaviourGoalsCheck: boolean;
  behaviourGoals: string;

  description: string;
  sciApproach: string;
  //--------------page3
  connections: string;
  multiApproach: string;
  toolJusti: string;
  sources: string;
  //----------page4
  method: string;
  microChanges: string;
  activityEllaboration: string;
  classOrg: string;
  //------------page5
  consensus: string;
  difficulties: string;
  noise: string;
  //--------------page6
  evaluation: string;
  reflection: string;


  constructor(){
    this.title = '';
    this.duration = '';
    this.eduProg = '';

    this.BloomTaxonomy = '';
    this.knowledgeGoalsCheck = false;
    this.knowledgeGoals = '';
    this.skillGoalsCheck = false;
    this.skillGoals = '';
    this.behaviourGoalsCheck = false;
    this.behaviourGoals = '';
    
    this.description = '';
    this.sciApproach = '';

    this.connections = '';
    this.multiApproach = '';
    this.toolJusti = '';
    this.sources = '';

    this.method = '';
    this.microChanges = '';
    this.activityEllaboration = '';
    this.classOrg = '';

    this.consensus = '';
    this.difficulties = '';
    this.noise = '';

    this.evaluation = '';
    this.reflection = '';
  }

  //this method is used to modify the data from the scenario class to get them ready for saving on the firestore collection
  public getFirestoreEntry(){
    return {
      title: this.title,
      duration: this.duration,
      eduProg: this.eduProg,

      BloomTaxonomy: this.BloomTaxonomy,
      knowledgeGoalsCheck: this.knowledgeGoalsCheck,
      knowledgeGoals: this.knowledgeGoals,
      skillGoalsCheck: this.skillGoalsCheck,
      skillGoals: this.skillGoals,
      behaviourGoalsCheck: this.behaviourGoalsCheck,
      behaviourGoals: this.behaviourGoals,

      description: this.description,
      sciApproach: this.sciApproach,
      
      connections: this.connections,
      multiApproach: this.multiApproach,
      toolJusti: this.toolJusti,
      sources: this.sources,
      
      method: this.method,
      microChanges: this.microChanges,
      activityEllaboration: this.activityEllaboration,
      classOrg: this.classOrg,
      
      consensus: this.consensus,
      difficulties: this.difficulties,
      noise: this.noise,
      
      evaluation: this.evaluation,
      reflection: this.reflection,
      };
  }
}