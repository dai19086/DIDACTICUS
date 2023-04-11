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


  constructor(  title: string = '', duration: string = '', eduProg: string = '',
    BloomTaxonomy: string = '',
    knowledgeGoalsCheck: boolean = false, knowledgeGoals: string = '',
    skillGoalsCheck: boolean = false, skillGoals: string = '',
    behaviourGoalsCheck: boolean = false, behaviourGoals: string = '',  
    description: string = '', sciApproach: string = '',
    connections: string = '', multiApproach: string = '', toolJusti: string = '', sources: string = '',
    method: string = '', microChanges: string = '', activityEllaboration: string = '', classOrg: string = '',
    consensus: string = '', difficulties: string = '', noise: string = '',
    evaluation: string = '', reflection: string = ''){
    this.title = title;
    this.duration = duration;
    this.eduProg = eduProg;

    this.BloomTaxonomy = BloomTaxonomy;
    this.knowledgeGoalsCheck = knowledgeGoalsCheck;
    this.knowledgeGoals = knowledgeGoals;
    this.skillGoalsCheck = skillGoalsCheck;
    this.skillGoals = skillGoals;
    this.behaviourGoalsCheck = behaviourGoalsCheck;
    this.behaviourGoals = behaviourGoals;
    
    this.description = description;
    this.sciApproach = sciApproach;

    this.connections = connections;
    this.multiApproach = multiApproach;
    this.toolJusti = toolJusti;
    this.sources = sources;

    this.method = method;
    this.microChanges = microChanges;
    this.activityEllaboration = activityEllaboration;
    this.classOrg = classOrg;

    this.consensus = consensus;
    this.difficulties = difficulties;
    this.noise = noise;

    this.evaluation = evaluation;
    this.reflection = reflection;
  }

  //serialization method
  serialize(): string {
    return JSON.stringify({ title: this.title, duration: this.duration, eduProg: this.eduProg,
      BloomTaxonomy: this.BloomTaxonomy, knowledgeGoalsCheck: this.knowledgeGoalsCheck, knowledgeGoals: this.knowledgeGoals,
      skillGoalsCheck: this.skillGoalsCheck, skillGoals: this.skillGoals, behaviourGoalsCheck: this.behaviourGoalsCheck, behaviourGoals: this.behaviourGoals,
      description: this.description, sciApproach: this.sciApproach, connections: this.connections,
      multiApproach: this.multiApproach, toolJusti: this.toolJusti, sources: this.sources,
      method: this.method, microChanges: this.microChanges, activityEllaboration: this.activityEllaboration,
      classOrg: this.classOrg, consensus: this.consensus, difficulties: this.difficulties,
      noise: this.noise, evaluation: this.evaluation, reflection: this.reflection
    });
  }
  //deserialization method
  static deserialize(str: string): Scenario {
    const { title, duration, eduProg, BloomTaxonomy, knowledgeGoalsCheck, knowledgeGoals,
      skillGoalsCheck, skillGoals, behaviourGoalsCheck, behaviourGoals, description, sciApproach, connections,
      multiApproach, toolJusti, sources, method, microChanges, activityEllaboration,
      classOrg, consensus, difficulties, noise, evaluation, reflection } = JSON.parse(str);

    return new Scenario(title, duration, eduProg, BloomTaxonomy, knowledgeGoalsCheck, knowledgeGoals,
      skillGoalsCheck, skillGoals, behaviourGoalsCheck, behaviourGoals, description, sciApproach, connections,
      multiApproach, toolJusti, sources, method, microChanges, activityEllaboration,
      classOrg, consensus, difficulties, noise, evaluation, reflection);
  }

  //this method is used to modify the data from the scenario class to get them ready for saving on the firestore collection
  public getFirestoreEntry(userID: string | undefined){
    return {
      uid: userID,//include storing user ID for querying purposes

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