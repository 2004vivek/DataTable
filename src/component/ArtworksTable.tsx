import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
// import { Checkbox } from 'primereact/checkbox';
import axios from 'axios';
// import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

interface Artwork {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

const ArtworksTable = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [isPageInputVisible, setIsPageInputVisible] = useState<boolean>(false);
    const [inputPageNumber, setInputPageNumber] = useState<string>('');  
    const fetchArtworks = async (page: number) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}`);
            setArtworks(response.data.data);
            setTotalRecords(response.data.pagination.total);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtworks(page);
    }, [page]);

    const onPageChange = (e: any) => {
        setPage(e.page + 1); 
    };

    // const onRowSelect = (e: any) => {
    //     setSelectedRows([...selectedRows, e.data]);
    // };

    // const onRowUnselect = (e: any) => {
    //     setSelectedRows(selectedRows.filter(row => row.id !== e.data.id));
    // };

    // const rowCheckboxTemplate = (rowData: Artwork) => {
    //     return (
    //         <Checkbox
    //             onChange={(e) => e.checked ? onRowSelect({data: rowData}) : onRowUnselect({data: rowData})}
    //             checked={selectedRows.some(row => row.id === rowData.id)}
    //         />
    //     );
    // };

   
    const togglePageInput = () => {
        setIsPageInputVisible(!isPageInputVisible);
    };

   
    const goToPage = () => {
        const pageNumber = parseInt(inputPageNumber, 10);
        if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= Math.ceil(totalRecords / 10)) {
            setPage(pageNumber);
        } else {
            alert("Please enter a valid page number.");
        }
    };

    return (
        <div className="datatable-responsive">
            <DataTable
                value={artworks}
                paginator
                lazy
                rows={10}
                totalRecords={totalRecords}
                first={(page - 1) * 10}
                onPage={onPageChange}
                loading={loading}
                selection={selectedRows}
                onSelectionChange={e => setSelectedRows(e.value)}
                dataKey="id"
            >
                <Column selectionMode="multiple" headerStyle={{width: '3em'}}></Column>

               
                <Column 
                    field="title" 
                    header={
                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span>Title</span>
                                <Button 
                                    icon="pi pi-chevron-down" 
                                    className="p-button-text p-button-sm p-ml-2" 
                                    onClick={togglePageInput}
                                />
                            </div>
                           
                            {isPageInputVisible && (
                                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '5px' }}>
                                    <input 
                                        value={inputPageNumber} 
                                        onChange={(e) => setInputPageNumber(e.target.value)} 
                                        placeholder="Select Rows..." 
                                        style={{ width: '120px',height:'34px', marginRight: '5px',marginBottom:'0.23rem' }}
                                    />
                                    <Button label="Submit" icon="pi pi-check" onClick={goToPage} />
                                </div>
                            )}
                        </div>
                    } 
                
                ></Column>

                <Column field="place_of_origin" header="Place of Origin" ></Column>
                <Column field="artist_display" header="Artist Display" sortable></Column>
                <Column field="inscriptions" header="Inscriptions"></Column>
                <Column field="date_start" header="Date Start" ></Column>
                <Column field="date_end" header="Date End" ></Column>
            </DataTable>
        </div>
    );
};

export default ArtworksTable;
