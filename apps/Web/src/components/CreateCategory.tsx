import { useMutation } from "@apollo/client";
import { useState } from "react";
import { CREATE_CATEGORY } from "../graphql/mutations";
import { GET_ALL_CATEGORIES } from "../graphql/queries";

const CreateCategory = () => {
  const [name, setName] = useState("");

  // Используем хук useMutation для выполнения мутации
  const [createCategory, { data, loading, error }] = useMutation(
    CREATE_CATEGORY,
    {
      // Обновляем кэш после создания новой категории
      update(cache, { data: { createCategory } }) {
        try {
          const existingCategories = cache.readQuery({
            query: GET_ALL_CATEGORIES, // Предполагается, что есть запрос для получения всех категорий
          });

          cache.writeQuery({
            query: GET_ALL_CATEGORIES,
            data: {
              categories: [...existingCategories?.categories, createCategory],
            },
          });
        } catch (e) {
          // Если запрос GET_ALL_CATEGORIES еще не был выполнен, ничего не делаем
        }
      },
      onError(err) {
        // Обработка ошибок (например, отображение уведомления)
        console.error("Ошибка при создании категории:", err);
      },
    },
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Название категории не должно быть пустым.");
      return;
    }

    try {
      await createCategory({ variables: { name } });
      setName(""); // Очистка поля после успешного создания
      alert("Категория успешно создана!");
    } catch (err) {
      // Ошибки уже обрабатываются в onError
    }
  };

  return (
    <div>
      <h2>Создать Новую Категорию</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Название Категории:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите название категории"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Создание..." : "Создать Категорию"}
        </button>
      </form>

      {/* Отображение результатов или ошибок */}
      {error && <p style={{ color: "red" }}>Ошибка: {error.message}</p>}
      {data && (
        <p style={{ color: "green" }}>
          Категория "{data.createCategory.name}" успешно создана с ID{" "}
          {data.createCategory.id}!
        </p>
      )}
    </div>
  );
};

export default CreateCategory;
