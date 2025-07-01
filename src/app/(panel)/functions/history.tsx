import FilterByField, { FilterOption } from "@/src/components/FilterByField";
import Header from "@/src/components/Header";
import SearchInput from "@/src/components/SearchInput";
import Separator from "@/src/components/Separator";
import {
  HistoricalItem,
  useHistoryDataRenderer,
} from "@/src/hooks/history/useHistoricalDataRenderer";
import { styles } from "@/src/styles/functions/historicalStyle";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const Options = [
  { label: "Placa", value: "placa" },
  { label: "Data", value: "data" },
];

const historicalMock: HistoricalItem[] = [
  {
    placa: "LSN 4L49",
    entrada: "23/06/2025",
    saida: "23/06/2025",
    permanencia: "3:25:00",
    valor: "25,00",
  },
  {
    placa: "ABC 1234",
    entrada: "22/06/2025",
    saida: "22/06/2025",
    permanencia: "2:00:00",
    valor: "20,00",
  },
];

export default function History() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterOption>("placa");

  const displayedData = useHistoryDataRenderer(historicalMock, filter);

  return (
    <View style={{ flex: 1 }}>
      <Header title="Historico" />

      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchInput
            search={search}
            setSearch={setSearch}
            inputWidth={"90%"}
          />
          <View style={{ width: "90%", justifyContent: "flex-start" }}>
            <FilterByField
              filter={filter}
              setFilter={setFilter}
              options={Options}
            />
          </View>
        </View>
        <View style={styles.body}>
          <Separator marginTop={10} style={{ width: "90%" }} />

          {displayedData.map((item, index) => (
            <View key={index} style={{ width: "100%" }}>
              <View style={styles.historicalRow}>
                <View style={styles.datahistorical}>
                  <Text style={styles.mainData}>{item.mainData}</Text>
                  <View style={styles.secondaryDatarow}>
                    {item.secondaryData.map((text, idx) => (
                      <Text key={idx} style={styles.secondaryData}>
                        {text}
                      </Text>
                    ))}
                  </View>
                </View>
                <View style={styles.buttontwoway}>
                  <Pressable
                    onPress={() => console.log("2ª via clicada")}
                    style={styles.buttonArea}
                  >
                    <Text style={styles.buttonText}>2°{"\n"}VIA</Text>
                  </Pressable>
                </View>
              </View>

              <Separator
                marginTop={6}
                style={{
                  width: "90%",
                  alignSelf: "center",
                  backgroundColor: "#ccc", // cor suave
                  height: 1, // espessura da linha
                }}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
