import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* Calendário */}
      <Calendar
        current={new Date().toISOString().split('T')[0]} // Exibe o mês e ano atuais
        markedDates={{
          [new Date().toISOString().split('T')[0]]: {
            selected: true,
            selectedColor: 'blue',
            selectedTextColor: 'white',
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
});

export default HomeScreen;
