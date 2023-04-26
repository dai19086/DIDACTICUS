import * as docx from 'docx';
import { saveAs } from 'file-saver';


import * as jspdf from 'jspdf';
import { amiri } from 'src/assets/text files/amiri';



export class Scenario {
  title: string;
  duration: string;
  eduProg: string;

  BloomTaxonomy: string;
  knowledgeGoalsCheck: boolean;
  knowledgeGoals: string;
  skillGoalsCheck: boolean;
  skillGoals: string;
  behaviourGoalsCheck: boolean;
  behaviourGoals: string;

  description: string;
  sciApproach: string;
  
  connections: string;
  multiApproach: string;
  toolJusti: string;
  sources: string;

  method: string;
  microChanges: string;
  activityEllaboration: string;
  classOrg: string;

  consensus: string;
  difficulties: string;
  noise: string;
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

  //method to download docx file using data from the scenario
  getScenarioDOCX(){
    const tableData =[["Τίτλος: ",this.title],["Εκτιμώμενη Διάρκεια: ",this.duration],["Τάξη: ",this.eduProg],
                      ["Στόχοι Γνώσεων: ",this.knowledgeGoals],["Στόχοι Δεξιοτήτων: ",this.skillGoals],["Στόχοι Στάσεων: ",this.behaviourGoals],
                      ["Συνοπτική Περιγραφή: ",this.description],["Επιστημολογική Προσέγγιση: ",this.sciApproach],
                      ["Διασυνδέσεις Εννοιών και Δραστηριοτήτων: ",this.connections],["Πολλαπλές Αναπαραστάσεις και Προσεγγίσεις: ",this.multiApproach],
                      ["Πρόβλεψη Δυσκολιών: ",this.difficulties],["Αιτιολόγηση Εργαλείων: ",this.toolJusti],
                      ["Διδακτικός Θόρυβος: ",this.noise],["Εξωτερικές Πηγές: ",this.sources],
                      ["Υποκειμενική Θεωρία Μάθησης: ",this.method],["Μικρομεταβολές: ",this.microChanges],
                      ["Διδακτικό Συμβόλαιο: ",this.consensus],["Οργάνωση Τάξης κι Εφικτότητα: ",this.classOrg],
                      ["Ανάλυση Φύλλων Εργασίας: ",this.activityEllaboration],
                      ["Αξιολόγηση Διδακτικού Σεναρίου: ",this.evaluation],["Αναστοχασμός: ",this.reflection]
                    ];
                    
    function createParagraph(text: string, bold = false, fontSize = 10): docx.TextRun {
      const line = new docx.TextRun({
        text: text,
        bold: bold,
        size: fontSize,
      });
      return line;
    }


    
    const wordDocContent = new docx.Paragraph({
      children: [createParagraph("DIDACTICUS: "+this.title,true,45)],
    spacing: {
      after: 200,
    }
    });

    const lineBreak = new docx.TextRun({
      text: "",
      break: 1
    });

    for (const [category, content] of tableData) {

      //change line twice to leave a blank line before you move on to the next data
      wordDocContent.addChildElement(lineBreak);
      wordDocContent.addChildElement(lineBreak);
      //add category
      wordDocContent.addChildElement(createParagraph(category, true, 28));
      //add content
      wordDocContent.addChildElement(createParagraph(content, false, 25));
    }

    const wordDoc = new docx.Document({
      sections: [{
        children: [
          wordDocContent
        ]
      }]
    });

    const fileName = "My Scenario (" + this.title + ") DIDACTICUS.docx";
    docx.Packer.toBlob(wordDoc).then((blob) => {
      saveAs(blob, fileName);
    });

  }

  //method to download pdf using data from the scenario
  getScenarioPDF(){
    //create data
    const tableData =[["Τίτλος: ",this.title],["Εκτιμώμενη Διάρκεια: ",this.duration],["Τάξη: ",this.eduProg],
                      ["Στόχοι Γνώσεων: ",this.knowledgeGoals],["Στόχοι Δεξιοτήτων: ",this.skillGoals],["Στόχοι Στάσεων: ",this.behaviourGoals],
                      ["Συνοπτική Περιγραφή: ",this.description],["Επιστημολογική Προσέγγιση: ",this.sciApproach],
                      ["Διασυνδέσεις Εννοιών και Δραστηριοτήτων: ",this.connections],["Πολλαπλές Αναπαραστάσεις και Προσεγγίσεις: ",this.multiApproach],
                      ["Πρόβλεψη Δυσκολιών: ",this.difficulties],["Αιτιολόγηση Εργαλείων: ",this.toolJusti],
                      ["Διδακτικός Θόρυβος: ",this.noise],["Εξωτερικές Πηγές: ",this.sources],
                      ["Υποκειμενική Θεωρία Μάθησης: ",this.method],["Μικρομεταβολές: ",this.microChanges],
                      ["Διδακτικό Συμβόλαιο: ",this.consensus],["Οργάνωση Τάξης κι Εφικτότητα: ",this.classOrg],
                      ["Ανάλυση Φύλλων Εργασίας: ",this.activityEllaboration],
                      ["Αξιολόγηση Διδακτικού Σεναρίου: ",this.evaluation],["Αναστοχασμός: ",this.reflection]
                    ];

    let pdf = new jspdf.jsPDF();    //initialize file
    

    //font for greek characters from https://codepen.io/kuznetsovvn/pen/jOyWMgq in file amiri.ts in the assets/text files
    const amiriFont = amiri;
    pdf.addFileToVFS("Amiri-Regular.ttf", amiriFont);
    pdf.addFont("Amiri-Regular.ttf", "Amiri", "normal");
		pdf.setFont("Amiri");
    
    //format file
    const startX = 10;
    const startY = 20;
    const cellHeight = 10;
    const cellWidth = 0;
    const spacing = 5;

    const columnWidths = tableData[0].map((_, i) => {
      const columnData = tableData.map(row => row[i]);
      const maxLength = Math.max(...columnData.map(cell => cell.toString().length));
      return Math.max(maxLength*2, cellWidth);
    });

    pdf.setFontSize(20);
    pdf.text(this.title,10, 10,);

    let xPos = startX;
    let yPos = startY;

    pdf.setFontSize(10);

    //construct data in file
    tableData.forEach(row => {
      let maxLines = 0;
      row.forEach((cell, i) => {
        const cellText = pdf.splitTextToSize(cell.toString(), 190-xPos, { delimiter: ' ' });
        
        if (i==0){
          maxLines = cellText.length;
          pdf.setFontSize(12);
        }else{
          if (cellText.length > maxLines) maxLines = cellText.length;
          pdf.setFontSize(10);
        }
        
        pdf.text(cellText, xPos, yPos);
        xPos += columnWidths[i] + spacing;
      });
      yPos += cellHeight*maxLines + spacing;
      xPos = startX;
    });

    pdf.output('dataurlnewwindow');                   //open file in new window
    pdf.save('MyScenario(' + this.title + ') DIDACTICUS.pdf');   //save file
  }
}