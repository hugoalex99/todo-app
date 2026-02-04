import { Link } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Page() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Bem-vindo ao App!
      </Text>
      <Link href="/task" asChild>
        <Button title="Ir para Lista de Tarefas" />
      </Link>
    </View>
  );
}
