import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import imagem from './assets/LOGO.png';

export default function App() {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const salvarProdutos = async (produtos) => {
    try {
      await AsyncStorage.setItem('produtos', JSON.stringify(produtos));
    } catch (e) {
      console.error('Erro ao salvar produtos:', e);
    }
  };

  const carregarProdutos = async () => {
    try {
      const produtosSalvos = await AsyncStorage.getItem('produtos');
      if (produtosSalvos) {
        setProdutos(JSON.parse(produtosSalvos));
      }
    } catch (e) {
      console.error('Erro ao carregar produtos:', e);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  useEffect(() => {
    salvarProdutos(produtos);
  }, [produtos]);

  const inserirProduto = () => {
    if (nome && quantidade) {
      if (editingId) {
        setProdutos(produtos.map(produto =>
          produto.id === editingId
            ? { ...produto, nome, quantidade: parseInt(quantidade) }
            : produto
        ));
        setEditingId(null);
      } else {
        setProdutos([...produtos, { id: Date.now().toString(), nome, quantidade: parseInt(quantidade) }]);
      }
      setNome('');
      setQuantidade('');
    }
  };

  const excluirProduto = (id) => {
    setProdutos(produtos.filter(produto => produto.id !== id));
  };

  const iniciarEdicao = (produto) => {
    setNome(produto.nome);
    setQuantidade(produto.quantidade.toString());
    setEditingId(produto.id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={imagem}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>A Cozinha da Jane</Text>
      </View>

      <TextInput
        placeholder="Nome do produto"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="Quantidade"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={inserirProduto}>
        <Text style={styles.buttonText}>{editingId ? "Salvar" : "Inserir"}</Text>
      </TouchableOpacity>

      <FlatList
        data={produtos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.nome}: {item.quantidade} (unidades)
            </Text>
            <TouchableOpacity style={styles.editButton} onPress={() => iniciarEdicao(item)}>
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => excluirProduto(item.id)}>
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#64434b',
  },
  header: {
    backgroundColor: '#64434b',
    paddingTop: 80,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#5a370d',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    color: '#fff',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    marginRight: 5,
  },
  editButtonText: {
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 5,
  },
  deleteButtonText: {
    color: '#fff',
  },
  image: {
    width: 100,
    height: 100,
  },
});

