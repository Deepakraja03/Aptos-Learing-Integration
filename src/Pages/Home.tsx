import { Aptos } from "@aptos-labs/ts-sdk"
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";

export const aptos = new Aptos();
export const moduleAddress = '0xfa3ff01ac17797bcb32c9c86121486726f01bf951b6c002a59cd9d7925934a1f';

type Student = {
    student_id: string;
    address: string;
    name: string;
    age: string;
    dept: string;
    year: string;
    sem: string;
}

const Home = () => {
    const { account, signAndSubmitTransaction } = useWallet();
    const [accountHasList, setAccountHasList] = useState<boolean>(false);
    const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [name, setName] = useState<string>("");
    const [age, setAge] = useState<string>("");
    const [dept, setDept] = useState<string>("");
    const [year, setYear] = useState<string>("");
    const [sem, setSem] = useState<string>("");

    useEffect(() => {
        fetchList();
    }, [account?.address])

    const fetchList = async () => {
        if (!account) return [];
        try {
            const studentListResource = await aptos.getAccountResource({
                accountAddress: account?.address,
                resourceType: `${moduleAddress}::lessonlist::StudentList`
            });
            setAccountHasList(true);
            const tableHandle = (studentListResource as any).students.handle;
            const studentCounter = (studentListResource as any).student_counter;
            let students = [];
            let counter = 1;
            while (counter <= studentCounter) {
                const tableItem = {
                    key_type: 'u64',
                    value_type: `${moduleAddress}::lessonlist:Student`,
                    key: `${counter}`,
                }
                const student = await aptos.getTableItem<Student>({ handle: tableHandle, data: tableItem });
                students.push(student);
                counter++;
            }
            setStudents(students);
        } catch (e: any) {
            setAccountHasList(false);
        }
    }

    const addNewList = async () => {
        if (!account) return [];
        setTransactionInProgress(true);
        const transaction: InputTransactionData = {
            data: {
                function: `${moduleAddress}::lessonlist::create_list`,
                functionArguments: []
            }
        }
        try {
            const result = await signAndSubmitTransaction(transaction);
            await aptos.waitForTransaction({ transactionHash: result.hash });
            setAccountHasList(true);
        } catch (error: any) {
            setAccountHasList(false);
        } finally {
            setTransactionInProgress(false);
        }
    }

    const addStudent = async () => {
        if (!account) return;
        setTransactionInProgress(true);
        const transaction:InputTransactionData = {
            data:{
                function: `${moduleAddress}::lessonlist::create_student`,
                functionArguments:[name, age, dept, year, sem]
            }
        }
        const latestId = students.length > 0 ? parseInt(students[students.length - 1].student_id) + 1: 1;
        const newStudentToPush = {
            address: account.address,
            name: name,
            age: age,
            dept: dept,
            year: year,
            sem: sem,
            student_id: latestId + "",
        }
        try {
            const response = await signAndSubmitTransaction(transaction);
            await aptos.waitForTransaction({transactionHash:response.hash});
            let newStudent = [...students];
      
            
            newStudent.push(newStudentToPush);
            setStudents(newStudent);
            setName("");
            setAge("");
            setDept("");
            setYear("");
            setSem("");
          } catch (error: any) {
            console.log("error", error);
          } finally {
            setTransactionInProgress(false);
          }
    }

    return (
        <div>
            {!accountHasList ? (
                <div>
                    <button
                        disabled={!account}
                        onClick={addNewList}
                    >
                        Add new list
                    </button>
                </div>
            ) : (
                <div>
                    <div>
                        <div>
                            <div>
                                <input placeholder="Enter Student Name" value={name} onChange={(e) => {setName(e.target.value)}} />
                                <input placeholder="Enter age" value={age} onChange={(e) => {setAge(e.target.value)}} />
                                <input placeholder="Add department" value={dept} onChange={(e) => {setDept(e.target.value)}} />
                                <input placeholder="Add year" value={year} onChange={(e) => {setYear(e.target.value)}} />
                                <input placeholder="Add semester" value={sem} onChange={(e) => {setSem(e.target.value)}} />
                                <button onClick={addStudent}>
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                    {students && (
                        <ul>
                            {students.map((student: Student, index: number) => (
                                <li key={index}>
                                    <div>
                                        <div>Name: {student.name}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            {transactionInProgress && (
                <div>
                    Loading
                </div>
            )}
        </div>
    )
}

export default Home;
