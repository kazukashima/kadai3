import { useState, useEffect } from "react";
import {
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  VStack,
  Spinner,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { supabase } from "./utils/supabase"; // ✅ supabaseクライアント
import { Record } from "./domain/record";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import { useForm, SubmitHandler, Controller } from "react-hook-form";

import { TableContainer } from "@chakra-ui/react";

function App() {
  const [records, setRecords] = useState<Record[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true); // ✅ ローディング状態
  const { isOpen, onOpen, onClose } = useDisclosure();

  // ✅ react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<Partial<Record>>();

  // ✅ データ取得関数
  const fetchData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("study-record").select("*");
     console.log("🔍 取得データ:", data);
  console.log("⚠️ エラー:", error);
    if (error) {
      console.error("データ取得エラー:", error);
      setIsLoading(false);
      return;
    }
    if (data) {
      const records = data.map((d) => new Record(d.id, d.title, d.time));
      setRecords(records);
    }
    setIsLoading(false);
  };

  // ✅ データ追加関数
  const onRecordRegist: SubmitHandler<Partial<Record>> = async (data) => {
    const { error } = await supabase.from("study-record").insert([
      { title: data.title, time: data.time },
    ]);
    if (error) {
      console.error("データ追加エラー", error);
      return;
    }
    await fetchData();
    reset(); // 入力内容をリセット
    onClose();
  };

// 削除関数
const onDelete =async (id:string)=> {
  const {error}=await supabase.from("study-record").delete().eq("id",id);
  if (error){
    console.log("削除エラー:", error);
  }else{
    await fetchData();
  } 
}




  // ✅ 初回マウント時に一覧を取得
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <VStack spacing={6} mt={6}>
      <Heading>学習記録アプリ</Heading>

      {/* エラー表示 */}
      {error && <Text color="red.500">{error}</Text>}

      {/* 一覧表示 */}
      {isLoading ? (
        <Spinner size="xl" />
      ) : (
        <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>学習内容</Th>
              <Th>時間</Th>
              <Th>操作</Th>
            </Tr>
          </Thead>
          <Tbody>
            {records.map((r) => (
              <Tr key={r.id}>
                <Td>{r.title}</Td>
                <Td>{r.time}</Td>
                <Td><Button size="sm" colorScheme="red" onClick={() => onDelete(r.id)}>削除</Button></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        </TableContainer>
      )}

      {/* 新規登録ボタン */}
      <Button onClick={onOpen} colorScheme="blue">
        新規登録
      </Button>

      {/* モーダル */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onRecordRegist)}>
            <ModalHeader>新規登録</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                {/* 学習内容 */}
                <FormControl isInvalid={!!errors.title}>
                  <FormLabel>学習内容</FormLabel>
                  <Input
                    placeholder="学習内容"
                    {...register("title", { required: "内容の入力は必須です" })}
                  />
                  {errors.title && (
                    <Text color="red.500">{errors.title.message}</Text>
                  )}
                </FormControl>

                {/* 学習時間 */}
                <FormControl isInvalid={!!errors.time}>
                  <FormLabel>学習時間</FormLabel>
                  <Controller
                    name="time"
                    control={control}
                    rules={{
                      required: "時間の入力は必須です",
                      min: { value: 1, message: "時間は0以上である必要があります" },
                    }}
                    render={({ field }) => (
                      <NumberInput
                        min={0}
                        value={field.value || 0}
                        onChange={(valueString) => {
                          const value = parseInt(valueString, 10);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />
                  {errors.time && (
                    <Text color="red.500">{errors.time.message}</Text>
                  )}
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="teal" type="submit">
                登録
              </Button>
              <Button variant="ghost" onClick={onClose} ml={3}>
                キャンセル
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

export default App;


