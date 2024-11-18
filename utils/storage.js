// utils/storage.js

import AsyncStorage from '@react-native-async-storage/async-storage';

// Função para salvar os pets no AsyncStorage
export const savePetsToStorage = async (pets) => {
  try {
    // Converte o array de pets para uma string JSON e armazena no AsyncStorage
    await AsyncStorage.setItem('pets', JSON.stringify(pets));
  } catch (error) {
    console.error('Erro ao salvar pets:', error);
  }
};

// Função para carregar os pets do AsyncStorage
export const loadPetsFromStorage = async () => {
  try {
    // Tenta obter os dados armazenados
    const pets = await AsyncStorage.getItem('pets');
    // Se houver dados, converte de volta para um array e retorna. Caso contrário, retorna um array vazio.
    return pets != null ? JSON.parse(pets) : [];
  } catch (error) {
    console.error('Erro ao carregar pets:', error);
    return [];
  }
};

// Função para limpar os dados de pets do AsyncStorage
export const clearPetsStorage = async () => {
  try {
    await AsyncStorage.removeItem('pets');
  } catch (error) {
    console.error('Erro ao limpar pets:', error);
  }
};
