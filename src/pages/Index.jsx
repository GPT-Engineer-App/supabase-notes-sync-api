import React, { useState, useEffect } from "react";
import { Box, Button, Input, Text, VStack, useToast } from "@chakra-ui/react";
import { FaPlus, FaSave, FaTrash } from "react-icons/fa";

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const toast = useToast();

  const supabaseUrl = "https://mnwefvnykbgyhbdzpleh.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ud2Vmdm55a2JneWhiZHpwbGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyNzQ3MzQsImV4cCI6MjAyODg1MDczNH0.tnHysd1LqayzpQ1L-PImcvlkUmkNvocpMS7tS-hYZNg";

  useEffect(() => {
    fetch(`${supabaseUrl}/rest/v1/notes`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
    })
      .then((response) => response.json())
      .then((data) => setNotes(data))
      .catch((error) => console.error("Error fetching notes:", error));
  }, []);

  const handleAddNote = () => {
    fetch(`${supabaseUrl}/rest/v1/notes`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ note: newNote }),
    })
      .then((response) => response.json())
      .then((data) => {
        setNotes([...notes, data[0]]);
        setNewNote("");
        toast({
          title: "Note added.",
          description: "We've added your note!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => console.error("Error adding note:", error));
  };

  const handleDeleteNote = (id) => {
    fetch(`${supabaseUrl}/rest/v1/notes?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        setNotes(notes.filter((note) => note.id !== id));
        toast({
          title: "Note deleted.",
          description: "We've deleted your note.",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => console.error("Error deleting note:", error));
  };

  return (
    <VStack spacing={4}>
      <Box>
        <Input placeholder="Write a new note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} />
        <Button leftIcon={<FaPlus />} onClick={handleAddNote} ml={2}>
          Add Note
        </Button>
      </Box>
      {notes.map((note) => (
        <Box key={note.id}>
          <Text>{note.note}</Text>
          <Button leftIcon={<FaTrash />} onClick={() => handleDeleteNote(note.id)} ml={2}>
            Delete
          </Button>
        </Box>
      ))}
    </VStack>
  );
};

export default Index;
