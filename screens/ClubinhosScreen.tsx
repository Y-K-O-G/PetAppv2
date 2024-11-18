// ClubinhosScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClubinhosScreen = () => {
  const navigation = useNavigation();
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const petsData = await AsyncStorage.getItem('pets');
        if (petsData) {
          const parsedPets = JSON.parse(petsData);
          const filteredPets = parsedPets.filter((pet: any) => pet.clubinho === 'sim');
          setPets(filteredPets);
        }
      } catch (error) {
        console.error('Erro ao carregar os pets:', error);
      }
    };

    fetchPets();
  }, []);

  const handlePressPet = (pet: any) => {
    navigation.navigate('PetProfile', { pet });
  };

  return (
    <ScrollView style={styles.container}>
      {pets.length > 0 ? (
        pets.map((pet, index) => (
          <TouchableOpacity
            key={index}
            style={styles.petCard}
            onPress={() => handlePressPet(pet)}>
            <Text style={styles.petName}>{pet.nome}</Text>
            <Text style={styles.tutorName}>{pet.tutor}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noPets}>Nenhum pet cadastrado no Clubinho.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  petCard: {
    backgroundColor: '#D3D3D3',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tutorName: {
    fontSize: 14,
    color: '#555',
  },
  noPets: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
  },
});

export default ClubinhosScreen;
