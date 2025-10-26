        let authToken = localStorage.getItem('adminToken');
        const API_URL = window.location.origin;

        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch(`${API_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    authToken = data.token;
                    localStorage.setItem('adminToken', authToken);
                    showAdminPanel();
                } else {
                    alert('Invalid credentials');
                }
            } catch (error) {
                alert('Login failed: ' + error.message);
            }
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('adminToken');
            authToken = null;
            location.reload();
        });

        function showAdminPanel() {
            document.getElementById('loginSection').classList.add('hidden');
            document.getElementById('adminPanel').classList.remove('hidden');
            document.getElementById('logoutBtn').style.display = 'block';
            loadAirdrops();
        }

        if (authToken) {
            showAdminPanel();
        }

        // Handle logo URL preview
        document.getElementById('logoUrl').addEventListener('input', function(e) {
            const url = e.target.value.trim();
            if (url) {
                document.getElementById('logoPreview').src = url;
                document.getElementById('logoPreview').style.display = 'block';
                document.getElementById('logoPreview').onerror = function() {
                    this.style.display = 'none';
                };
            } else {
                document.getElementById('logoPreview').style.display = 'none';
            }
        });

        // Step-by-step guide functionality
        let stepCounter = 0;

        function addStep(stepText = '', stepImage = '') {
            stepCounter++;
            const stepId = `step-${stepCounter}`;
            const stepHtml = `
                <div class="step-item" id="${stepId}" style="background: #f9fafb; padding: 20px; border-radius: 8px; border: 2px solid #e5e7eb;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h4 style="margin: 0; color: #6366f1;">Step ${stepCounter}</h4>
                        <button type="button" class="btn btn--outline remove-step-btn" data-step-id="${stepId}" style="padding: 8px 16px; font-size: 14px;">
                            Remove
                        </button>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Step Description</label>
                        <textarea class="step-description" placeholder="Describe this step..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; min-height: 80px;">${stepText}</textarea>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Step Image URL</label>
                        <div style="display: flex; gap: 15px; align-items: start;">
                            <input type="url" class="step-image" placeholder="https://example.com/step-image.png" value="${stepImage}" style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                            <img class="step-image-preview" src="${stepImage}" alt="Preview" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; border: 2px solid #ddd; ${stepImage ? 'display: block;' : 'display: none;'}">
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('stepsContainer').insertAdjacentHTML('beforeend', stepHtml);
            
            // Add image preview handler
            const stepElement = document.getElementById(stepId);
            const imageInput = stepElement.querySelector('.step-image');
            const imagePreview = stepElement.querySelector('.step-image-preview');
            
            imageInput.addEventListener('input', function(e) {
                const url = e.target.value.trim();
                if (url) {
                    imagePreview.src = url;
                    imagePreview.style.display = 'block';
                    imagePreview.onerror = function() {
                        this.style.display = 'none';
                    };
                } else {
                    imagePreview.style.display = 'none';
                }
            });
        }

        // Event delegation for dynamically added remove buttons
        document.getElementById('stepsContainer').addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-step-btn') || e.target.closest('.remove-step-btn')) {
                const button = e.target.closest('.remove-step-btn') || e.target;
                const stepId = button.getAttribute('data-step-id');
                document.getElementById(stepId).remove();
            }
        });

        document.getElementById('addStepBtn').addEventListener('click', () => {
            addStep();
        });

        function clearSteps() {
            document.getElementById('stepsContainer').innerHTML = '';
            stepCounter = 0;
        }

        function getStepsData() {
            const steps = [];
            document.querySelectorAll('.step-item').forEach(stepElement => {
                const description = stepElement.querySelector('.step-description').value.trim();
                const image = stepElement.querySelector('.step-image').value.trim();
                if (description) {
                    steps.push({ description, image });
                }
            });
            return steps;
        }

        document.getElementById('showFormBtn').addEventListener('click', () => {
            document.getElementById('airdropForm').classList.remove('hidden');
            document.getElementById('airdropFormElement').reset();
            document.getElementById('airdropId').value = '';
            document.getElementById('logoUrl').value = '';
            document.getElementById('logoPreview').style.display = 'none';
            clearSteps();
            addStep(); // Add first step by default
        });

        document.getElementById('cancelFormBtn').addEventListener('click', () => {
            document.getElementById('airdropForm').classList.add('hidden');
        });

        document.getElementById('airdropFormElement').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const steps = getStepsData();

            const airdropData = {
                name: document.getElementById('name').value,
                description: document.getElementById('description').value,
                blockchain: document.getElementById('blockchain').value,
                type: document.getElementById('type').value,
                status: document.getElementById('status').value,
                logo: document.getElementById('logoUrl').value,
                airdropLink: document.getElementById('airdropLink').value,
                website: document.getElementById('website').value,
                twitter: document.getElementById('twitter').value,
                discord: document.getElementById('discord').value,
                telegram: document.getElementById('telegram').value,
                totalValue: document.getElementById('totalValue').value,
                estimatedReward: document.getElementById('estimatedReward').value,
                startDate: document.getElementById('startDate').value,
                endDate: document.getElementById('endDate').value,
                requirements: steps,
                category: document.getElementById('type').value,
                featured: document.getElementById('featured')?.checked || false,
                ended: document.getElementById('status').value === 'ended',
                potential: document.getElementById('potential')?.checked || false,
                confirmed: document.getElementById('confirmed')?.checked || false
            };

            const airdropId = document.getElementById('airdropId').value;
            const method = airdropId ? 'PUT' : 'POST';
            const url = airdropId ? `${API_URL}/api/airdrops/${airdropId}` : `${API_URL}/api/airdrops`;

            try {
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify(airdropData)
                });

                if (response.ok) {
                    alert(airdropId ? 'Airdrop updated successfully!' : 'Airdrop created successfully!');
                    document.getElementById('airdropForm').classList.add('hidden');
                    loadAirdrops();
                } else if (response.status === 401 || response.status === 403) {
                    alert('Your session has expired. Please log in again.');
                    localStorage.removeItem('adminToken');
                    authToken = null;
                    location.reload();
                } else {
                    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                    alert(`Failed to save airdrop: ${errorData.error || response.statusText}`);
                    console.error('Server error:', errorData);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });

        async function loadAirdrops() {
            try {
                const response = await fetch(`${API_URL}/api/airdrops`);
                const data = await response.json();
                
                // Handle paginated response format
                const airdrops = Array.isArray(data) ? data : (data.airdrops || []);
                
                const tbody = document.getElementById('airdropsList');
                
                if (airdrops.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #666;">No airdrops yet. Create your first airdrop!</td></tr>';
                    return;
                }
                
                tbody.innerHTML = airdrops.map(airdrop => {
                    const logoHtml = airdrop.logo && (airdrop.logo.startsWith('http://') || airdrop.logo.startsWith('https://') || airdrop.logo.startsWith('data:'))
                        ? `<img src="${airdrop.logo}" alt="${airdrop.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">`
                        : `<span style="font-size: 32px;">${airdrop.logo || '🎁'}</span>`;
                    
                    return `
                    <tr>
                        <td>${logoHtml}</td>
                        <td>${airdrop.name}</td>
                        <td>${airdrop.blockchain}</td>
                        <td>${airdrop.type}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn--sm btn-small edit-airdrop-btn" data-airdrop-id="${airdrop.id}">Edit</button>
                                <button class="btn btn--sm btn-small btn--outline delete-airdrop-btn" data-airdrop-id="${airdrop.id}">Delete</button>
                            </div>
                        </td>
                    </tr>
                `;
                }).join('');
            } catch (error) {
                console.error('Error loading airdrops:', error);
                alert('Failed to load airdrops: ' + error.message);
            }
        }

        // Event delegation for edit and delete buttons (set up once at module level)
        document.getElementById('airdropsList').addEventListener('click', async function(e) {
            const editBtn = e.target.closest('.edit-airdrop-btn');
            const deleteBtn = e.target.closest('.delete-airdrop-btn');
            
            if (editBtn) {
                const id = editBtn.getAttribute('data-airdrop-id');
                await editAirdrop(id);
            } else if (deleteBtn) {
                const id = deleteBtn.getAttribute('data-airdrop-id');
                await deleteAirdrop(id);
            }
        });

        async function editAirdrop(id) {
            try {
                const response = await fetch(`${API_URL}/api/airdrops/${id}`);
                const airdrop = await response.json();
                
                document.getElementById('airdropId').value = airdrop.id;
                document.getElementById('name').value = airdrop.name;
                document.getElementById('description').value = airdrop.description;
                document.getElementById('blockchain').value = airdrop.blockchain;
                document.getElementById('type').value = airdrop.type;
                document.getElementById('status').value = airdrop.status;
                document.getElementById('logoUrl').value = airdrop.logo || '';
                
                if (airdrop.logo) {
                    document.getElementById('logoPreview').src = airdrop.logo;
                    document.getElementById('logoPreview').style.display = 'block';
                }
                
                document.getElementById('airdropLink').value = airdrop.airdropLink || '';
                document.getElementById('website').value = airdrop.website || '';
                document.getElementById('twitter').value = airdrop.twitter || '';
                document.getElementById('discord').value = airdrop.discord || '';
                document.getElementById('telegram').value = airdrop.telegram || '';
                document.getElementById('totalValue').value = airdrop.totalValue || '';
                document.getElementById('estimatedReward').value = airdrop.estimatedReward || '';
                document.getElementById('startDate').value = airdrop.startDate || '';
                document.getElementById('endDate').value = airdrop.endDate || '';
                
                clearSteps();
                const requirements = airdrop.requirements || [];
                if (requirements.length > 0) {
                    if (typeof requirements[0] === 'object' && requirements[0].description) {
                        requirements.forEach(step => {
                            addStep(step.description, step.image || '');
                        });
                    } else {
                        requirements.forEach(req => {
                            addStep(req, '');
                        });
                    }
                } else {
                    addStep();
                }
                
                const featuredEl = document.getElementById('featured');
                if (featuredEl) featuredEl.checked = airdrop.featured || false;
                
                const potentialEl = document.getElementById('potential');
                if (potentialEl) potentialEl.checked = airdrop.potential || false;
                
                const confirmedEl = document.getElementById('confirmed');
                if (confirmedEl) confirmedEl.checked = airdrop.confirmed || false;
                
                document.getElementById('airdropForm').classList.remove('hidden');
            } catch (error) {
                alert('Error loading airdrop: ' + error.message);
            }
        }

        async function deleteAirdrop(id) {
            if (!confirm('Are you sure you want to delete this airdrop?')) return;
            
            try {
                const response = await fetch(`${API_URL}/api/airdrops/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                if (response.ok) {
                    alert('Airdrop deleted successfully!');
                    loadAirdrops();
                } else if (response.status === 401 || response.status === 403) {
                    alert('Your session has expired. Please log in again.');
                    localStorage.removeItem('adminToken');
                    authToken = null;
                    location.reload();
                } else {
                    const errorText = await response.text();
                    alert('Failed to delete airdrop: ' + errorText);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }
