import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Button, Alert, Linking, ScrollView } from 'react-native';
import { savePetsToStorage, loadPetsFromStorage } from '../utils/storage'; // Importando as funções corretas
import { TextInputMask } from 'react-native-masked-text';
import RNPickerSelect from 'react-native-picker-select';




export default function PetsScreen() {
  const [modalVisible, setModalVisible] = useState(false); // Modal de cadastro/edição de pet
  const [viewingPetModalVisible, setViewingPetModalVisible] = useState(false); // Modal de visualização de informações
  const [petName, setPetName] = useState('');
  const [breed, setBreed] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [clubinho, setClubinho] = useState('nao');
  const [shampooProprio, setShampooProprio] = useState('nao');
  const [perfume, setPerfume] = useState('nao');

  const [pets, setPets] = useState([]);
  const [selectedPetIndex, setSelectedPetIndex] = useState(null);
  const [viewingPet, setViewingPet] = useState(null);

  const [errors, setErrors] = useState({
    petName: false,
    breed: false,
    ownerName: false,
    phone: false,
    address: false,
  });

  useEffect(() => {
    const loadPets = async () => {
      try {
        const storedPets = await loadPetsFromStorage(); // Carregando os pets com a função de utilitário
        if (storedPets) {
          setPets(storedPets.sort((a, b) => a.petName.localeCompare(b.petName)));
        }
      } catch (error) {
        console.error('Erro ao carregar os pets: ', error);
      }
    };

    loadPets();
  }, []);

  const resetFields = () => {
    setPetName('');
    setBreed('');
    setOwnerName('');
    setPhone('');
    setAddress('');
    setClubinho('nao');
    setShampooProprio('nao');
    setPerfume('nao');
    setErrors({
      petName: false,
      breed: false,
      ownerName: false,
      phone: false,
      address: false,
    });
  };

  const handleCancel = () => {
    resetFields(); // Limpa os campos de entrada
    setModalVisible(false); // Fecha o modal de cadastro de pet
  };

  const handleSave = async () => {
    const newErrors = {
      petName: !petName,
      breed: !breed,
      ownerName: !ownerName,
      phone: !phone,
      address: !address,
    };
    setErrors(newErrors);

    if (Object.values(newErrors).includes(true)) return;

    const duplicatePet = pets.some((pet, index) =>
      pet.petName === petName && pet.phone === phone && index !== selectedPetIndex
    );

    if (duplicatePet) {
      Alert.alert('Erro', 'Pet já cadastrado!');
      return;
    }

    const newPet = { petName, breed, ownerName, phone, address, clubinho, shampooProprio, perfume };
    let updatedPets;

    if (selectedPetIndex !== null) {
      updatedPets = [...pets];
      updatedPets[selectedPetIndex] = newPet;
    } else {
      updatedPets = [...pets, newPet];
    }

    updatedPets.sort((a, b) => a.petName.localeCompare(b.petName));
    setPets(updatedPets);
    await savePetsToStorage(updatedPets); // Usando a função de utilitário para salvar
    setModalVisible(false);
    resetFields();
    setSelectedPetIndex(null); // Reset selectedPetIndex after saving
  };

  const handleEdit = (index) => {
    const pet = pets[index];
    setPetName(pet.petName);
    setBreed(pet.breed);
    setOwnerName(pet.ownerName);
    setPhone(pet.phone);
    setAddress(pet.address);
    setClubinho(pet.clubinho);
    setShampooProprio(pet.shampooProprio);
    setPerfume(pet.perfume);
    setSelectedPetIndex(index); // Track selected pet index for editing
    setViewingPetModalVisible(false); // Close the viewing modal when editing
    setModalVisible(true); // Open the edit modal
  };

  const handleDelete = async () => {
    if (selectedPetIndex === null) return;

    Alert.alert('Excluir Pet', 'Você tem certeza que deseja excluir este pet?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        onPress: async () => {
          const updatedPets = pets.filter((_, i) => i !== selectedPetIndex);
          setPets(updatedPets);
          await savePetsToStorage(updatedPets); // Atualizando o armazenamento após exclusão
          setViewingPet(null); // Reset viewing pet after deletion
          setSelectedPetIndex(null); // Reset selectedPetIndex after deletion
          setViewingPetModalVisible(false); // Close the pet info modal after deletion
        },
      },
    ]);
  };

  const handleCloseModal = () => {
    resetFields();
    setModalVisible(false);
    setSelectedPetIndex(null); // Reset index when closing modal
    setViewingPetModalVisible(false); // Close the viewing modal
  };

  const handlePhoneCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
      console.error('Erro ao tentar fazer a ligação:', err)
    );
  };

  const handleViewPet = (index) => {
    setSelectedPetIndex(index);
    setViewingPet(pets[index]);
    setViewingPetModalVisible(true); // Show the pet's details modal
  };

  const handleOpenAddress = (address) => {
    Linking.openURL(`https://www.google.com/maps/search/?q=${address}`).catch((err) =>
      console.error('Erro ao tentar abrir o mapa:', err)
    );
  };

  

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.title}>Cadastrar Pet</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Cadastro / Edição */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cadastrar Pet</Text>

            <Text style={styles.inputLabel}>Nome do Pet</Text>
            <TextInput
              style={[styles.input, errors.petName && styles.inputError]}
              value={petName}
              onChangeText={setPetName}
            />

            <Text style={styles.inputLabel}>Raça</Text>
            <TextInput
              style={[styles.input, errors.breed && styles.inputError]}
              value={breed}
              onChangeText={setBreed}
            />

            <Text style={styles.inputLabel}>Nome do Tutor</Text>
            <TextInput
              style={[styles.input, errors.ownerName && styles.inputError]}
              value={ownerName}
              onChangeText={setOwnerName}
            />

            <Text style={styles.inputLabel}>Telefone</Text>
            <TextInputMask
              type={"custom"}
              options={{
                mask: "(99)99999-9999", // Definindo a máscara para o telefone
              }}
              value={phone}
              keyboardType="numeric"
              onChangeText={setPhone}
              style={[styles.input, errors.phone && styles.inputError]} // Aplica o estilo de erro se necessário
              placeholder="(xx)xxxxx-xxxx"
            />

            <Text style={styles.inputLabel}>Endereço</Text>
            <TextInput
              style={[styles.input, errors.address && styles.inputError]}
              value={address}
              onChangeText={setAddress}
            />

            <Text style={styles.inputLabel}>Clubinho</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                onPress={() => setClubinho("sim")}
                style={styles.radioButtonContainer}
              >
                <View
                  style={[
                    styles.radioButton,
                    clubinho === "sim" && styles.radioButtonSelectedBlue, // Azul para "Sim"
                  ]}
                />
                <Text style={styles.radioText}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setClubinho("nao")}
                style={styles.radioButtonContainer}
              >
                <View
                  style={[
                    styles.radioButton,
                    clubinho === "nao" && styles.radioButtonSelectedRed, // Vermelho para "Não"
                  ]}
                />
                <Text style={styles.radioText}>Não</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Shampoo próprio</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                onPress={() => setShampooProprio("sim")}
                style={styles.radioButtonContainer}
              >
                <View
                  style={[
                    styles.radioButton,
                    shampooProprio === "sim" && styles.radioButtonSelectedBlue, // Azul para "Sim"
                  ]}
                />
                <Text style={styles.radioText}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShampooProprio("nao")}
                style={styles.radioButtonContainer}
              >
                <View
                  style={[
                    styles.radioButton,
                    shampooProprio === "nao" && styles.radioButtonSelectedRed, // Vermelho para "Não"
                  ]}
                />
                <Text style={styles.radioText}>Não</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Usa perfume</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                onPress={() => setPerfume("sim")}
                style={styles.radioButtonContainer}
              >
                <View
                  style={[
                    styles.radioButton,
                    perfume === "sim" && styles.radioButtonSelectedBlue, // Azul para "Sim"
                  ]}
                />
                <Text style={styles.radioText}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setPerfume("nao")}
                style={styles.radioButtonContainer}
              >
                <View
                  style={[
                    styles.radioButton,
                    perfume === "nao" && styles.radioButtonSelectedRed, // Vermelho para "Não"
                  ]}
                />
                <Text style={styles.radioText}>Não</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleSave} style={styles.buttonBlue}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleCancel} style={styles.buttonGray}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de visualização de pet */}
      <Modal
        visible={viewingPetModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Informações do Pet</Text>

            {viewingPet && (
              <>
                <Text style={styles.petDetail}>
                  Nome do Pet: {viewingPet.petName}
                </Text>
                <Text style={styles.petDetail}>Raça: {viewingPet.breed}</Text>
                <Text style={styles.petDetail}>
                  Tutor: {viewingPet.ownerName}
                </Text>
                <Text style={styles.petDetail}>
                  Telefone: {viewingPet.phone}
                </Text>
                <Text style={styles.petDetail}>
                  Endereço: {viewingPet.address}
                </Text>
                <Text style={styles.petDetail}>
                  Clubinho: {viewingPet.clubinho === "sim" ? "Sim" : "Não"}
                </Text>
                <Text style={styles.petDetail}>
                  Shampoo próprio:{" "}
                  {viewingPet.shampooProprio === "sim" ? "Sim" : "Não"}
                </Text>
                <Text style={styles.petDetail}>
                  Usa perfume: {viewingPet.perfume === "sim" ? "Sim" : "Não"}
                </Text>

                <TouchableOpacity
                  onPress={() => handlePhoneCall(viewingPet.phone)}
                  style={styles.buttonGreen}
                >
                  <Text style={styles.buttonText}>Ligar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleEdit(selectedPetIndex)}
                  style={styles.buttonBlue}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDelete}
                  style={styles.buttonRed}
                >
                  <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setViewingPetModalVisible(false)}
                  style={styles.buttonGray}
                >
                  <Text style={styles.buttonText}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Lista de pets */}
      <ScrollView contentContainerStyle={styles.petList}>
        {pets.map((pet, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleViewPet(index)}
            style={styles.petItem}
          >
            <Text style={styles.petName}>{pet.petName}</Text>
            <Text style={styles.ownerName}>Tutor: {pet.ownerName}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E90FF', // Cor da barrinha azul
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#fff', // Botão de adicionar pet agora branco
    borderRadius: 50, // Aumentei o valor para garantir que seja bem redondo
    width: 50, // Define uma largura fixa para garantir que o botão fique consistente
    height: 50, // Define uma altura fixa para que o botão seja igual em todos os lados
    justifyContent: 'center', // Alinha o conteúdo (texto) ao centro
    alignItems: 'center', // Alinha o conteúdo (texto) ao centro
  },
  addButtonText: {
    color: '#1E90FF', // Texto do botão azul
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputLabel: {
    marginVertical: 5,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 5,
    backgroundColor: '#fff',
  },
  radioButtonSelectedBlue: {
    backgroundColor: '#1E90FF', // Azul para "Sim"
  },
  
  radioButtonSelectedRed: {
    backgroundColor: '#ff0000', // Vermelho para "Não"
  },
  radioText: {
    fontSize: 16,
  },
  petList: {
    paddingVertical: 10,
  },
  petItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 5,
    alignItems: 'flex-start',
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ownerName: {
    fontSize: 14,
    color: '#888',
  },
  petDetail: {
    fontSize: 16,
    marginVertical: 5,
  },
  linkText: {
    color: '#1E90FF',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  buttonGreen: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonBlue: {
    backgroundColor: '#1E90FF',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonRed: {
    backgroundColor: '#ff0000', // Botão Excluir agora vermelho
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonGray: {
    backgroundColor: '#A9A9A9',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
