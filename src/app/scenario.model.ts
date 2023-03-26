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
}