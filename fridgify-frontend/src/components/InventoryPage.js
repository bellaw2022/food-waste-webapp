import React, { useEffect, useState } from 'react';

const InventoryPage = () => {
    const [inventory, setInventory] = useState([]);
    const [editMode, setEditMode] = useState(null);

    useEffect(() => {
        
        fetch('http://127.0.0.1:5000/api/user/1/inventory')
            .then((response) => response.json())
            .then((data) => setInventory(data))
            .catch((error) => console.error('Error fetching inventory:', error));
    }, []);

    const handleEdit = (index) => {
        setEditMode(index);
    };

    const handleSave = (index) => {
        const updatedItem = inventory[index];
        // Save updated item via API call
        fetch(`http://127.0.0.1:5000/api/inventory/${updatedItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedItem),
        }).then(() => setEditMode(null));
    };

    const handleChange = (event, index) => {
        const { name, value } = event.target;
        const updatedInventory = [...inventory];
        updatedInventory[index][name] = value;
        setInventory(updatedInventory);
    };

    return (
        <div>
            <h2>Inventory</h2>
            <table>
                <thead>
                    <tr>
                        <th>Produce</th>
                        <th>Quantity</th>
                        <th>Expiration Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((item, index) => (
                        <tr key={item.id}>
                            <td>{item.produce_name}</td>
                            <td>
                                {editMode === index ? (
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={item.quantity}
                                        onChange={(e) => handleChange(e, index)}
                                    />
                                ) : (
                                    item.quantity
                                )}
                            </td>
                            <td>
                                {editMode === index ? (
                                    <input
                                        type="date"
                                        name="expiration_date"
                                        value={item.expiration_date}
                                        onChange={(e) => handleChange(e, index)}
                                    />
                                ) : (
                                    item.expiration_date
                                )}
                            </td>
                            <td>
                                {editMode === index ? (
                                    <button onClick={() => handleSave(index)}>Save</button>
                                ) : (
                                    <button onClick={() => handleEdit(index)}>Edit</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryPage;
