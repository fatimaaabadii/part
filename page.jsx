"use client";
import { DataTable } from "@/components/table/table";
import { dataDeplacement } from "@/data/deplacement/deplacement-data";
import { dataEmployee } from "@/data/employee/employee-data";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import Modal from "react-modal";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { useQuery } from "@tanstack/react-query";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { api, getDeplacement, getUsers, getCurrentUser } from "@/api";
import { QueryClient, QueryClientProvider } from 'react-query';
import ReactDOM from 'react-dom';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { deplacementColumns } from "@/data/deplacement/deplacement-columns";
const Page = () => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "0",
      width: "50vw",
    },
  };
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modelDeleteIsOpen, setModelDeleteIsOpen] = useState(false);
  const [value, setValue] = useState();
  const [selectedValue, setselectedValue] = useState();
  const [dateSaisie, setdateSaisie] = useState(
    selectedValue?.dateSaisie || ""
  );
  const [dateHeureDepart, setdateHeureDepart] = useState(selectedValue?.dateHeureDepart || "");
  const [dateHeureArrive, setdateHeureArrive] = useState(selectedValue?.dateHeureArrive || "");
  const [comboBoxOpen, setComboBoxOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [typeOfSubmit, settypeOfSubmit] = useState("create");

  const deplacementColumns = [
    {
      accessorKey: "id",
      header: "Id",
      cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "employee",
      header: () => <div className="">Employé </div>,
      cell: async ({ row }) => {
        // Récupérer l'ID de l'employé pour cette ligne
        const employeeId = row.getValue("idEmploye");
    
        try {
          // Faire une requête à la base de données pour récupérer les détails de l'employé
          
    
          // Si l'employé est trouvé, afficher son nom
          return <div className="font-medium">{employeeData.nom}</div>;
        } catch (error) {
          console.error('Erreur lors de la récupération des détails de l\'employé:', error);
          return <div className="font-medium">Nom non trouvé</div>;
        }
      },
    },
    {
      accessorKey: "numOrdre",
      header: "numOrdre",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("numOrdre")}</div>
      ),
    },
    {
      accessorKey: "numOM",
      header: "numOM",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("numOM")}</div>
      ),
    }, {
      accessorKey: "matricule",
      header: "matricule",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("matricule")}</div>
      ),
    }, {
      accessorKey: "objet",
      header: "objet",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("objet")}</div>
      ),
    },
    
    {
      accessorKey: "moyenTransport",
      header: "moyenTransport",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("moyenTransport")}</div>
      ),
    },
    {
      accessorKey: "fraisTransport",
      header: "fraisTransport",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("fraisTransport")}</div>
      ),
    },
  
    {
      accessorKey: "nbrTaux",
      header: "nbrTaux",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nbrTaux")}</div>
      ),
    },
    {
      accessorKey: "priseEC",
      header: "priseEC",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("priseEC")}</div>
      ),
    },
  
  
    {
      accessorKey: "dateSaisie",
      header: () => <div className="">dateSaisie</div>,
      cell: ({ row }) => {
        const dateAchat = parseFloat(row.getValue("dateSaisie"));
  
        return <div className=" font-medium">{dateSaisie}</div>;
      },
    },
    {
      accessorKey: "dateHeureDepart",
      header: () => <div className="">dateHeureDepart</div>,
      cell: ({ row }) => {
        const dateHeureDepart = parseFloat(row.getValue("dateHeureDepart"));
  
        return <div className=" font-medium">{dateHeureDepart}</div>;
      },
    },
    {
      accessorKey: "dateHeureArrive",
      header: () => <div className="">dateHeureArrive</div>,
      cell: ({ row }) => {
        const dateHeureArrive = parseFloat(row.getValue("dateHeureArrive"));
  
        return <div className=" font-medium">{dateHeureArrive}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => {
                  //get selected row data
                  setselectedValue(row.original);
                  setAchatDate(row.original.dateAchat);
                  setAffectationDate(row.original.dateAffectation);
                  setIsOpen(true);
                  settypeOfSubmit("update");
                }}
              >
                Mettre à jour cette ligne
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setselectedValue(row.original);

                  setModelDeleteIsOpen(true);
                }}
              >
                Supprimer cette ligne
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const { toast } = useToast()

  //use query to get data from the server
  const { data, refetch } = useQuery({
    queryKey: ['deplacements'],
    queryFn: getDeplacement(),
  });
  const { data: usersData, } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers(),
  });
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (typeOfSubmit === "create" && value) {
      try {
        await api.post("/deplacement/" + value, {
          ...selectedValue
        })
        refetch()
        toast({
          description: "Déplacement créé avec succès",
          className: "bg-green-500 text-white",
          duration: 2000,
          title: "Success",
        })
        setIsOpen(false);
      } catch (e) {
        toast({
          description: "Erreur lors de la création d'un nouveau déplacement",
          className: "bg-red-500 text-white",
          duration: 2000,
          title: "Error",
        })
      }
    }
    else if (typeOfSubmit === "update" && value) {
      try {
        console.log(typeOfSubmit, value, selectedValue);
        await api.put("/deplacement/" + selectedValue.id + '/employee/' + value, {
          ...selectedValue,
          dateAchat: achatDate,
          dateAffectation: affectationDate,
        })
        refetch()
        toast({
          description: "Déplacement mis à jour avec succès",
          className: "bg-green-500 text-white",
          duration: 2000,
          title: "Success",
        })
        setIsOpen(false);
      } catch (e) {
        toast({
          description: "Erreur lors de la mise à jour du déplacement",
          className: "bg-red-500 text-white",
          duration: 2000,
          title: "Error",
        })
      }
    }
  }

  return (
    <div className="px-6 py-4" id="Deplacements">
      <DeleteModal
        closeModal={() => setModelDeleteIsOpen(false)}
        modalIsOpen={modelDeleteIsOpen}
        selectedValue={selectedValue}
        refetch={refetch}
        toast={toast}
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
       
        contentLabel="Example Modal"
      >
        <form className="max-w-full mx-auto  py-6 bg-white shadow-md rounded-md" onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold mb-4 px-6">
            {typeOfSubmit === "create"
              ? "Créer un nouveau déplacement"
              : " Mettre à jour le déplacement actuel"}
          </h2>
          <div className=" px-6  mb-4">
            <label className="block mb-1" for="numOM">
            numOM
            </label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="text"
              id="numOM"
              placeholder="numOM"
              value={selectedValue?.numOM || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  numOM: e.target.value,
                });
              }}
            />
          </div>
          
          
          <div className=" px-6  mb-4">
            <label className="block mb-1" for="numOrdre">
            numOrdre
            </label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="text"
              id="numOrdre"
              placeholder="numOrdre"
              value={selectedValue?.numOrdre || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  numOrdre: e.target.value,
                });
              }}
            />
          </div>
          <div className=" px-6  mb-4">
            <label className="block mb-1" for="matricule">
            matricule
            </label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="text"
              id="matricule"
              placeholder="matricule"
              value={selectedValue?.matricule || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  matricule: e.target.value,
                });
              }}
            />
          </div>
          <div className=" px-6  mb-4">
            <label className="block mb-1" for="moyenTransport">
            moyenTransport
            </label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="text"
              id="moyenTransport"
              placeholder="moyenTransport"
              value={selectedValue?.moyenTransport || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  moyenTransport: e.target.value,
                });
              }}
            />
          </div>
          <div className=" px-6  mb-4">
            <label className="block mb-1" for="fraisTransport">
            fraisTransport
            </label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="text"
              id="fraisTransport"
              placeholder="fraisTransport"
              value={selectedValue?.fraisTransport || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  fraisTransport: e.target.value,
                });
              }}
            />
          </div>
          <div className=" px-6  mb-4">
            <label className="block mb-1" for="priseEC">
            priseEC
            </label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="text"
              id="priseEC"
              placeholder="priseEC"
              value={selectedValue?.priseEC || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  priseEC: e.target.value,
                });
              }}
            />
          </div>
          
          <div className=" px-6  mb-4">
            <label className="block mb-1" for="objet">
            objet
            </label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="text"
              id="objet"
              placeholder="objet"
              value={selectedValue?.objet || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  objet: e.target.value,
                });
              }}
            />
          </div>
          <div className=" px-6  mb-4">
            <label className="block mb-1" for="nbrTaux">
            nbrTaux
            </label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="text"
              id="nbrTaux"
              placeholder="nbrTaux"
              value={selectedValue?.nbrTaux || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  nbrTaux: e.target.value,
                });
              }}
            />
          </div>
          <div className=" px-6  mb-4 flex flex-col">
            <label className="block mb-1" for="dateSaisie">
            dateSaisie
            </label>
            <DatePicker
              className="w-full border rounded-md px-3 py-2"
              date={dateSaisie}
              setDate={dateSaisie}
            />
          </div>
          <div className=" px-6  mb-4 flex flex-col">
            <label className="block mb-1" for="dateHeureDepart">
            dateHeureDepart
            </label>
            <DatePicker
              className="w-full border rounded-md px-3 py-2"
              date={dateHeureDepart}
              setDate={dateHeureDepart}
            />
          </div>
          <div className=" px-6  mb-4 flex flex-col">
            <label className="block mb-1" for="dateHeureArrive">
               dateHeureArrive
            </label>
            <DatePicker
              className="w-full border rounded-md px-3 py-2"
              date={dateHeureArrive}
              setDate={dateHeureArrive}
            />
          </div>
          <div className=" px-6  mb-4 flex flex-col w-full">
            <label className="block mb-1" for="employee">
              Employé
            </label>
            <Dropdown
              comboBoxOpen={comboBoxOpen}
            
              data={employeeData?.map(item => ({
                value: item.id.toString(),
                label: item.name
              })) || []}
              setComboBoxOpen={setComboBoxOpen}
              value={value}
              setValue={setValue}
            />
          </div>{" "}
          <div className=" px-6  mb-4 flex flex-col">
            <label className="block mb-1" for="dateSaisie">
            dateSaisie
            </label>
            <DatePicker
              className="w-full border rounded-md px-3 py-2"
              date={dateSaisie}
              setDate={dateSaisie}
            />
          </div>
          
       
         
          
          
          <div className="mt-4 px-6 flex justify-end">
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-md">
              Envoyer
            </button>
          </div>
        </form>
      </Modal>
      <DataTable
        title={"Déplacements"}
        filterCol="numOrdre"
        columns={deplacementColumns}
        data={data || []}
        setOpenModal={openModal}
        settypeOfSubmit={settypeOfSubmit}
        canAdd={true}
      />
    </div>
  );
};

export default Page;

const DeleteModal = ({ modalIsOpen, afterOpenModal, closeModal, selectedValue, refetch, toast }) => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "0",
      width: "fit-content",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.delete("/deplacement/" + selectedValue.id)
      toast({
        description: "deleted successfully",
        className: "bg-green-500 text-white",
        duration: 2000,
        title: "Success",
      })
      refetch()
      closeModal()
    } catch (e) {
      toast({
        description: "Error deleting deplacement",
        className: "bg-red-500 text-white",
        duration: 2000,
        title: "Error",
      })
      console.log(e);
    }
  }
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      
      contentLabel="Example Modal"
    >
      <form className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold mb-4">Supprimer</h2>
        <div className="mb-4">
          <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={closeModal}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md">
          
            Annuler
          </button>
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded-md">
          
            Supprimer
          </button>
        </div>
      </form>
    </Modal>
  );
};


