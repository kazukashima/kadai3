import {
  Button,
  Heading,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { supabase } from "./utils/supabase";
import { Record } from "./domain/record";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

function App() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 編集対象のレコード（nullなら新規登録）
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<{ title: string; time: number }>({
    defaultValues: { title: "", time: 0 },
  });

  // ✅ データ取得
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("study-record").select("*");
      if (error) {
        setError(error.message);
      } else if (data) {
        const recs = data.map((d) => new Record(d.id, d.title, d.time));
        setRecords(recs);
      }
    } catch (e) {
      console.error("❌ fetchDataで例外発生:", e);
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ 新規登録 or 編集処理
  const onSubmit: SubmitHandler<{ title: string; time: number }> = async (
    values
  ) => {
    if (editingRecord) {
      // 編集処理
      const { error } = await supabase
        .from("study-record")
        .update({
          title: values.title,
          time: values.time,
        })
        .eq("id", editingRecord.id);

      if (error) {
        setError(error.message);
      }
    } else {
      // 新規登録処理
      const { error } = await supabase.from("study-record").insert([
        {
          title: values.title,
          time: values.time,
        },
      ]);
      if (error) {
        setError(error.message);
      }
    }

    reset({ title: "", time: 0 });
    setEditingRecord(null);
    onClose();
    fetchData();
  };

  // ✅ 編集ボタン押下時
  const handleEdit = (record: Record) => {
    setEditingRecord(record);
    reset({ title: record.title, time: record.time });
    onOpen();
  };

  // ✅ 削除処理
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("study-record").delete().eq("id", id);
    if (error) {
      setError(error.message);
    } else {
      fetchData();
    }
  };

  // ✅ キャンセル時
  const handleClose = () => {
    setEditingRecord(null);
    reset({ title: "", time: 0 });
    onClose();
  };

  return (
    <VStack spacing={4} p={4}>
      <Heading as="h2">シン・学習記録アプリ</Heading>

      {loading ? (
        <Spinner size="xl" role="status" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <>
          <Button
            onClick={() => {
              setEditingRecord(null);
              reset({ title: "", time: 0 });
              onOpen();
            }}
            colorScheme="blue"
          >
            新規登録
          </Button>

          <TableContainer>
  <Table variant="simple">
    <Thead>
      <Tr>
        <Th>タイトル</Th>
        <Th>時間</Th>
        <Th>操作</Th>
      </Tr>
    </Thead>
    <Tbody>
      {records.map((r) => (
        <Tr key={r.id}>
          <Td>{r.title}</Td>
          <Td>{r.time}</Td>
          <Td>
            <Button
              size="sm"
              colorScheme="teal"
              mr={2}
              onClick={() => handleEdit(r)}
            >
              編集
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              onClick={() => handleDelete(r.id)}
            >
              削除
            </Button>
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
</TableContainer>

        </>
      )}

      {/* ✅ モーダル */}
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingRecord ? "記録編集" : "新規登録"}</ModalHeader>
          <ModalBody>
            <form id="record-form" onSubmit={handleSubmit(onSubmit)}>
              {/* 学習内容 */}
              <FormControl isInvalid={!!errors.title}>
                <FormLabel>学習内容</FormLabel>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: "内容の入力は必須です" }}
                  render={({ field }) => (
                    <Input {...field} placeholder="学習内容" />
                  )}
                />
                {errors.title && (
                  <Text color="red.500">{errors.title.message}</Text>
                )}
              </FormControl>

              {/* 学習時間 */}
              <FormControl mt={4} isInvalid={!!errors.time}>
                <FormLabel>学習時間</FormLabel>
                <Controller
                  name="time"
                  control={control}
                  rules={{
                    required: "時間の入力は必須です",
                    min: { value: 1, message: "時間は1以上である必要があります" },
                  }}
                  render={({ field }) => (
                    <NumberInput
                      min={0}
                      value={field.value ?? ""}
                      onChange={(_, valueAsNumber) =>
                        field.onChange(
                          Number.isNaN(valueAsNumber) ? "" : valueAsNumber
                        )
                      }
                    >
                      <NumberInputField />
                    </NumberInput>
                  )}
                />
                {errors.time && (
                  <Text color="red.500">{errors.time.message}</Text>
                )}
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" form="record-form" colorScheme="blue">
              {editingRecord ? "保存" : "登録"}
            </Button>
            <Button onClick={handleClose}>キャンセル</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

export default App;
