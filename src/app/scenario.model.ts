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

  //declares that some fields of the scenario are filled
  isNotEmpty(): boolean {
    return ((this.title != "") ||
      (this.duration != "") ||
      (this.eduProg != "") ||
      (this.BloomTaxonomy != "") ||
      (this.knowledgeGoals != "") ||
      (this.skillGoals != "") ||
      (this.behaviourGoals != "") ||
      (this.description != "") ||
      (this.sciApproach != "") ||
      (this.connections != "") ||
      (this.multiApproach != "") ||
      (this.toolJusti != "") ||
      (this.sources != "") ||
      (this.method != "") ||
      (this.microChanges != "") ||
      (this.activityEllaboration != "") ||
      (this.classOrg != "") ||
      (this.consensus != "") ||
      (this.difficulties != "") ||
      (this.noise != "") ||
      (this.evaluation != "") ||
      (this.reflection != "")
      );
  }

  //serialization method from this scenario to JSON
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
  //deserialization method from JSON to new Scenario
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
    //construct data
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

    //create a function that will be called repeatitivle to create the lines of the docx file
    function createParagraph(text: string, bold = false, fontSize = 10): docx.TextRun {
      const line = new docx.TextRun({
        text: text,
        bold: bold,
        size: fontSize,
      });
      return line;
    }


    //start a paragraph with a title in the first row
    const wordDocContent = new docx.Paragraph({
      children: [createParagraph("DIDACTICUS: "+this.title,true,45)],
    spacing: {
      after: 200,
    }
    });

    //createing a TextRun to change lines
    const lineBreak = new docx.TextRun({
      text: "",
      break: 1
    });

    //building the rest of the paragraph
    for (const [category, content] of tableData) {

      //change line twice to leave a blank line before you move on to the next data
      wordDocContent.addChildElement(lineBreak);
      wordDocContent.addChildElement(lineBreak);
      //add category
      wordDocContent.addChildElement(createParagraph(category, true, 28));
      //add content
      wordDocContent.addChildElement(createParagraph(content, false, 25));
    }

    //put the created content in a new docx Document
    const wordDoc = new docx.Document({
      sections: [{
        children: [
          wordDocContent
        ]
      }]
    });

    //set the filename with which the file will be downloaded
    const fileName = "My Scenario (" + this.title + ") DIDACTICUS.docx";
    //get the document in a blob object and ready for downloading
    docx.Packer.toBlob(wordDoc).then((blob) => {
      saveAs(blob, fileName); //download file
    });

  }

  //method to download pdf using data from the scenario
  getScenarioPDF(){
    //construct data
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

    let pdf = new jspdf.jsPDF();    //initialize a pdf file
    

    //setting font for greek characters from https://codepen.io/kuznetsovvn/pen/jOyWMgq in file amiri.ts in the assets/text files
    const amiriFont = amiri;
    pdf.addFileToVFS("Amiri-Regular.ttf", amiriFont);
    pdf.addFont("Amiri-Regular.ttf", "Amiri", "normal");
		pdf.setFont("Amiri");
    
    let y = 15;
    //starting the file with the title
    pdf.setFontSize(24);
    const headerText = "DIDACTICUS: " + this.title;
    const headerLines = pdf.splitTextToSize(headerText,180); //split the header into lines to fit the file
    pdf.text(headerLines,20, y,);
    y += headerLines.length * 10 +5; //moving down as many lines as we wrote and one more for spacing

    //constructing the data from tableData in lines of the file
    
    for (const [title, content] of tableData) {
      const lines = pdf.splitTextToSize(`${content}`, 180); //split the content into lines to fit the file
  
      //if the lines with the title that will be added overflow the page
      if (y + (lines.length + 1) * 5 >= pdf.internal.pageSize.height - 10) {  //y(the line that we currently are) + (the lines + 1*(title))*5(the space that each line occupy) >= (the space that the page fit) - 10(empty space in the bottom)
        pdf.addPage();    //add a new page
        y = 25;           //start from the same position
      }
      
      //setting the title fontSize and printing the title
      pdf.setFontSize(14);
      pdf.text(title, 15, y);
      y += 5;                   //moving down 1 line
      //setting content fontSize and printing the lines of content
      pdf.setFontSize(11);
      pdf.text(lines, 15, y);
      y += lines.length * 5 +5; //moving down as many lines as we wrote and one more for spacing
    }

    pdf.output('dataurlnewwindow');                              //open file in new window
    pdf.save('MyScenario(' + this.title + ') DIDACTICUS.pdf');   //save file with custom name
  }
}