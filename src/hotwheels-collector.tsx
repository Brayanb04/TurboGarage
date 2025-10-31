import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate de React Router
import {
  Plus,
  Search,
  Car,
  Heart,
  TrendingUp,
  Package,
  Edit2,
  Trash2,
  Upload,
  FileText,
  FolderOpen,
  ChevronRight,
  Home,
  X,
  Camera,
} from "lucide-react";
import hotwheelsData from "./data/hotwheels-2025-data.json"; 

// 🔹 Cargar categorías desde el JSON
const CATEGORIES_2025 = hotwheelsData.categories.map((c) => c.name);

export default function HotWheelsCollector() {
  const [cars, setCars] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentYear, setCurrentYear] = useState<number | null>(2025);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [editingCar, setEditingCar] = useState<any>(null);
  const [filterMode, setFilterMode] = useState<"all" | "acquired" | "notAcquired">("all");

  const [newCar, setNewCar] = useState({
    name: "",
    year: 2025,
    collection: "",
    number: "",
    color: "",
    variant: "",
    favorite: false,
    acquired: false,
    image: "",
  });

  // 🔹 Carga inicial desde el JSON o desde localStorage
 useEffect(() => {
  try {
    // Verificar que el archivo JSON esté correctamente cargado
    console.log('Cargando datos de Hot Wheels...', hotwheelsData);

    // Mapeando las categorías y carros desde el archivo JSON
    const loadedCars = hotwheelsData.categories.flatMap((category) => {
      // Verificar cada categoría antes de mapear
      console.log('Cargando categoría:', category.name);
      
      const carsInCategory = category.cars.map((car, index) => {
        // Verificar cada coche que se está mapeando
        console.log(`Cargando coche ${car.name} en categoría ${category.name}`);

        return {
          id: `${category.name}-${index}`,
          name: car.name,
          year: hotwheelsData.year,
          collection: category.name,
          number: car.series_number,
          variant: car.variant,
          color: "", // Sin color por defecto
          favorite: false,
          acquired: false,
          image: car.image,
        };
      });

      return carsInCategory;
    });

    console.log('Datos de coches cargados:', loadedCars);

    // Verificar si hay datos cargados correctamente antes de setear el estado
    if (loadedCars.length > 0) {
      setCars(loadedCars);
    } else {
      console.error('No se encontraron coches para cargar.');
    }
    
  } catch (error) {
    console.error('Error al cargar los datos de Hot Wheels:', error);
  }

  // Verificar si hay algún error cargando desde localStorage
  const savedCars = localStorage.getItem("hotwheels-collection");
  if (savedCars) {
    console.log('Cargando colección guardada desde localStorage.');
    setCars(JSON.parse(savedCars));
  } else {
    console.log('No se encontró colección guardada, cargando desde el JSON.');
  }

}, []); // Solo se ejecuta una vez al inicio


  // 🔹 Guardar cambios en localStorage
  useEffect(() => {
    if (cars.length > 0) {
      localStorage.setItem("hotwheels-collection", JSON.stringify(cars));
    }
  }, [cars]);

  // -----------------------
  // Funciones principales
  // -----------------------

  const addCar = () => {
    if (newCar.name && newCar.year && newCar.collection) {
      if (editingCar) {
        setCars(
          cars.map((car) =>
            car.id === editingCar.id ? { ...newCar, id: editingCar.id } : car
          )
        );
        setEditingCar(null);
      } else {
        setCars([...cars, { ...newCar, id: Date.now() }]);
      }

      setNewCar({
        name: "",
        year: currentYear || 2025,
        collection: currentCategory || "",
        number: "",
        color: "",
        variant: "",
        favorite: false,
        acquired: false,
        image: "",
      });
      setShowAddModal(false);
    }
  };

  const deleteCar = (id: string) => {
    if (confirm("¿Eliminar este carro de tu colección?")) {
      setCars(cars.filter((car) => car.id !== id));
    }
  };

  const editCar = (car: any) => {
    setNewCar(car);
    setEditingCar(car);
    setShowAddModal(true);
  };

  const toggleFavorite = (id: string) => {
    setCars(
      cars.map((car) =>
        car.id === id ? { ...car, favorite: !car.favorite } : car
      )
    );
  };

  const toggleAcquired = (id: string) => {
    setCars(
      cars.map((car) =>
        car.id === id ? { ...car, acquired: !car.acquired } : car
      )
    );
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCar({ ...newCar, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // -----------------------
  // Filtros y categorías
  // -----------------------

  const getFilteredCars = () => {
    let filtered = cars;

    if (currentYear !== null) {
      filtered = filtered.filter((car) => car.year === currentYear);
    }

    if (currentCategory !== null) {
      filtered = filtered.filter((car) => car.collection === currentCategory);
    }

    if (filterMode === "acquired") {
      filtered = filtered.filter((car) => car.acquired);
    } else if (filterMode === "notAcquired") {
      filtered = filtered.filter((car) => !car.acquired);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (car) =>
          car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (car.collection &&
            car.collection.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (car.variant &&
            car.variant.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  const filteredCars = getFilteredCars();

  const getCategories = () => CATEGORIES_2025;

  const getCategoryCarCount = (category: string) =>
    cars.filter(
      (car) => car.year === currentYear && car.collection === category
    ).length;

  const stats = {
    total: cars.length,
    favorites: cars.filter((car) => car.favorite).length,
    acquired: cars.filter((car) => car.acquired).length,
    categories: CATEGORIES_2025.length,
  };

  

  // -----------------------
  // Render principal
  // -----------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800">
      {/* HEADER */}
      <div className="bg-blue-950 bg-opacity-80 backdrop-blur-sm text-gray-300 p-4 sticky top-0 z-40 shadow-lg border-b border-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-900 rounded-lg border-2 border-gray-400 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-300">TG</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-200">
                  TURBO GARAGE
                </h1>
                <p className="text-xs text-gray-400">
                  Hot Wheels Collection Manager
                </p>
              </div>
            </div>

            

            {/* Botón de agregar */}
            <button
              onClick={() => {
                setEditingCar(null);
                setNewCar({
                  name: "",
                  year: currentYear || 2025,
                  collection: currentCategory || "",
                  number: "",
                  color: "",
                  variant: "",
                  favorite: false,
                  acquired: false,
                  image: "",
                });
                setShowAddModal(true);
              }}
              className="bg-gray-400 text-blue-950 px-3 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-300 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar</span>
            </button>
            
          </div>

          {/* Buscador */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar carros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-blue-900 bg-opacity-50 text-gray-200 placeholder-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {/* FILTRO DE ADQUIRIDOS */}
          <div className="flex gap-2 justify-center mb-4">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1 rounded-lg font-semibold text-sm border ${
                filterMode === "all"
                  ? "bg-gray-400 text-blue-900 border-gray-300"
                  : "bg-gray-700 text-gray-200 border-gray-600"
              }`}
            >
              🏁 Todos ({stats.total})
            </button>
            <button
              onClick={() => setFilterMode("acquired")}
              className={`px-3 py-1 rounded-lg font-semibold text-sm border ${
                filterMode === "acquired"
                  ? "bg-green-500 text-white border-green-400"
                  : "bg-gray-700 text-gray-200 border-gray-600"
              }`}
            >
              ✅ Adquiridos ({stats.acquired})
            </button>
            <button
              onClick={() => setFilterMode("notAcquired")}
              className={`px-3 py-1 rounded-lg font-semibold text-sm border ${
                filterMode === "notAcquired"
                  ? "bg-yellow-500 text-blue-950 border-yellow-400"
                  : "bg-gray-700 text-gray-200 border-gray-600"
              }`}
            >
              🛒 No adquiridos ({stats.total - stats.acquired})
            </button>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-6xl mx-auto p-4">
        {currentCategory === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {getCategories().map((category) => {
              const count = getCategoryCarCount(category);
              console.log(`Categoría: ${category}, Cantidad de carros: ${count}`);
              return (
                <button
                  key={category}
                  onClick={() => setCurrentCategory(category)}
                  className="bg-blue-900 bg-opacity-40 backdrop-blur-sm rounded-lg p-4 border border-gray-600 hover:border-gray-400 transition-all hover:scale-105 text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Package className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span className="bg-gray-700 text-gray-200 text-xs font-bold px-2 py-1 rounded-full">
                      {count}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-gray-200 leading-tight">
                    {category}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <>
            {filteredCars.length === 0 ? (
              <div className="text-center py-16">
                <Car className="w-24 h-24 mx-auto text-gray-400 opacity-50 mb-4" />
                <h2 className="text-2xl font-bold text-gray-200 mb-2">
                  No se encontraron carros
                </h2>
                <p className="text-gray-400 mb-6">
                  Intenta con otra categoría o filtro
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCars.map((car) => (
                  <div
                    key={car.id}
                    className="bg-blue-900 bg-opacity-40 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 border border-gray-600"
                  >
                    {car.image ? (
                      <div className="h-48 bg-blue-950 relative">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-full object-contain p-2"
                        />
                        {car.acquired && (
                          <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                            ✅ Adquirido
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="h-48 bg-blue-950 flex items-center justify-center border-b border-gray-700">
                        <Car className="w-16 h-16 text-gray-600 opacity-50" />
                      </div>
                    )}

                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-200 mb-2">
                        {car.name}
                      </h3>
                      {car.number && (
                        <div className="text-sm text-gray-400 mb-3">
                          <TrendingUp className="inline w-4 h-4 mr-1" />
                          #{car.number}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => toggleAcquired(car.id)}
                          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors border font-semibold ${
                            car.acquired
                              ? "bg-green-600 hover:bg-green-500 border-green-700 text-white"
                              : "bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200"
                          }`}
                        >
                          {car.acquired
                            ? "✅ Adquirido"
                            : "🛒 No adquirido"}
                        </button>
                        <button
                          onClick={() => toggleFavorite(car.id)}
                          className="bg-gray-800 text-gray-200 p-2 rounded-lg hover:bg-gray-700 border border-gray-600"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              car.favorite
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400"
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => editCar(car)}
                          className="bg-gray-600 text-gray-200 py-2 px-3 rounded-lg hover:bg-gray-500 border border-gray-500"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCar(car.id)}
                          className="bg-red-900 text-gray-200 py-2 px-3 rounded-lg hover:bg-red-800 border border-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL AGREGAR y EDITAR */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-blue-950 rounded-xl max-w-md w-full my-8 border border-gray-600">
            <div className="p-6 max-h-screen overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-200">
                  {editingCar ? "Editar Carro" : "Agregar Carro"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCar(null);
                  }}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={newCar.name}
                    onChange={(e) =>
                      setNewCar({ ...newCar, name: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-blue-900 bg-opacity-50 border border-gray-600 rounded-lg text-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={newCar.collection}
                    onChange={(e) =>
                      setNewCar({ ...newCar, collection: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-blue-900 bg-opacity-50 border border-gray-600 rounded-lg text-gray-200"
                  >
                    <option value="">Selecciona una</option>
                    {CATEGORIES_2025.map((cat) => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Número
                  </label>
                  <input
                    type="text"
                    value={newCar.number}
                    onChange={(e) =>
                      setNewCar({ ...newCar, number: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-blue-900 bg-opacity-50 border border-gray-600 rounded-lg text-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Variante
                  </label>
                  <input
                    type="text"
                    value={newCar.variant}
                    onChange={(e) =>
                      setNewCar({ ...newCar, variant: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-blue-900 bg-opacity-50 border border-gray-600 rounded-lg text-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Imagen
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-400"
                  />
                </div>

                <button
                  onClick={addCar}
                  className="w-full bg-gray-400 text-blue-950 font-semibold py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {editingCar ? "Guardar Cambios" : "Agregar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
