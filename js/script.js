new Vue({
  el: "#notebook",
  // Some data
  data() {
    return {
      notes: JSON.parse(localStorage.getItem("notes")) || [],
      selectedId: localStorage.getItem("selected-id") || null,
    };
  },
  computed: {
    selectedNote() {
      // We return the matching note with selectedId
      return this.notes.find((note) => note.id === this.selectedId);
    },
    notePreview() {
      return this.selectedNote ? marked(this.selectedNote.content) : "";
    },
    sortedNotes() {
      return this.notes
        .slice()
        .sort((a, b) => a.created - b.created)
        .sort((a, b) => (a.favorite === b.favorite ? 0 : a.favorite ? -1 : 1));
    },
    linesCount() {
      if (this.selectedNote) {
        // Count the number of new line characters
        return this.selectedNote.content.split(/\r\n|\r|\n/).length;
      }
    },
    wordsCount() {
      if (this.selectedNote) {
        var s = this.selectedNote.content;
        // Turn new line cahracters into white-spaces
        s = s.replace(/\n/g, " ");
        // Exclude start and end white-spacess = s.replace(/(^\s*)|(\s*$)/gi, '')
        // Turn 2 or more duplicate white-spaces into 1
        s = s.replace(/\s\s+/gi, " ");
        // Return the number of spaces
        return s.split(" ").length;
      }
    },
    charactersCount() {
      if (this.selectedNote) {
        return this.selectedNote.content.split("").length;
      }
    },
  },
  methods: {
    addNote() {
      const time = Date.now();
      const note = {
        id: String(time),
        title: "New note " + (this.notes.length + 1),
        content:
          "**Hi!** This notebook is using [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for formatting!",
        created: time,
        favorite: false,
      };
      this.notes.push(note);
    },
    selectNote(note) {
      this.selectedId = note.id;
    },
    saveNotes() {
      localStorage.setItem("notes", JSON.stringify(this.notes));
      console.log("Notes saved!", new Date());
    },
    removeNote() {
      if (this.selectedNote && confirm("Delete the note?")) {
        // Remove the note in the notes array
        const index = this.notes.indexOf(this.selectedNote);
        if (index !== -1) {
          this.notes.splice(index, 1);
        }
      }
    },
    favoriteNote() {
      this.selectedNote.favorite ^= true;
    },
  },

  created() {
    // Set the content to the stored value
    // or to a default string if nothing was saved
    this.content =
      localStorage.getItem("content") || "You can write in **markdown**";
  },
  watch: {
    notes: {
      // The method name
      handler: "saveNotes",
      // We need this to watch each note's properties inside the array
      deep: true,
    },
    // Let's save the selection too
    selectedId(val) {
      localStorage.setItem("selected-id", val);
    },
  },
  filters: {
    date(val) {
      return moment(val).format("DD MMM YYYY, HH:mm:ss");
    },
  },
});
console.log("restored note:", localStorage.getItem("content"));
