export async function updateEntity(encounterId, entityId, data) {
    const url = 'http://127.0.0.1:3000/entity/update?id=' + entityId;

    data.encounterId = encounterId;

    console.log("Updating entity:" + entityId, data);

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.text();
        console.log('Success:', result);
        return result;
    } catch (error) {
        console.error('Error updating entity:', error);
        throw error;
    }
}
