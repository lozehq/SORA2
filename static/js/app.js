// Sora Video Generation Frontend
class EnhancedSelect {
    constructor(selector) {
        this.select = document.querySelector(selector);
        if (!this.select) {
            throw new Error(`Select element ${selector} not found`);
        }
        this.select.classList.add('enhanced-select');
    }

    get value() {
        return this.select.value;
    }

    setValue(value) {
        this.select.value = value;
        this.select.dispatchEvent(new Event('change'));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const promptTextarea = document.getElementById('prompt');
    const charCountSpan = document.getElementById('charCount');
    const generateBtn = document.getElementById('generateBtn');
    const statusIndicator = document.getElementById('statusIndicator');
    const outputContent = document.getElementById('outputContent');
    const responseLog = document.getElementById('responseLog');
    const quickPromptChips = document.querySelectorAll('.prompt-chip');
    const resolutionSelect = new EnhancedSelect('#resolution');
    const aspectBtns = document.querySelectorAll('.aspect-btn');
    
    // History elements
    const historySidebar = document.getElementById('historySidebar');
    const historyToggleBtn = document.getElementById('historyToggleBtn');
    const historyList = document.getElementById('historyList');
    const historyBadge = document.getElementById('historyBadge');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    
    // Mode switching elements
    const modeBtns = document.querySelectorAll('.mode-btn');
    const imageUploadPanel = document.getElementById('imageUploadPanel');
    const imageUploadGroup = document.getElementById('imageUploadGroup');
    const promptLabel = document.getElementById('promptLabel');
    const promptHelper = document.getElementById('promptHelper');
    
    // Image upload elements
    const imageUploadArea = document.getElementById('imageUploadArea');
    const imageUpload = document.getElementById('imageUpload');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const removeImageBtn = document.getElementById('removeImageBtn');
    
    // Video player elements
    const videoPlayerContainer = document.getElementById('videoPlayerContainer');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoSource = document.getElementById('videoSource');
    const videoLoading = document.getElementById('videoLoading');
    const downloadVideoBtn = document.getElementById('downloadVideoBtn');
    const copyVideoUrlBtn = document.getElementById('copyVideoUrlBtn');
    
    // Progress elements
    const progressContainer = document.getElementById('progressContainer');
    const progressBarFill = document.getElementById('progressBarFill');
    const progressPercentage = document.getElementById('progressPercentage');
    const progressMessage = document.getElementById('progressMessage');
    const elapsedTime = document.getElementById('elapsedTime');
    const estimatedTime = document.getElementById('estimatedTime');
    
    // Dashboard / Log elements
    const logWrapper = document.getElementById('logWrapper');
    const logToggleBtn = document.getElementById('logToggleBtn');
    const apiStatus = document.getElementById('apiStatus');
    const openDocsBtn = document.getElementById('openDocsBtn');
    const viewHistoryBtn = document.getElementById('viewHistoryBtn');
    const totalGenerationsEl = document.getElementById('totalGenerations');
    const todayCountEl = document.getElementById('todayCount');
    const avgDurationEl = document.getElementById('avgDuration');
    const lastDurationEl = document.getElementById('lastDuration');
    const lastGeneratedAtEl = document.getElementById('lastGeneratedAt');
    const lastModeEl = document.getElementById('lastMode');
    const lastParamsEl = document.getElementById('lastParams');

    // State
    let isGenerating = false;
    let currentMode = 'text'; // 'text' or 'image'
    let uploadedImageBase64 = null;
    let currentVideoUrl = null;
    let currentAspectRatio = '16:9';
    let generationHistory = [];
    let currentHistoryId = null;
    let progressStartTime = null;
    let progressTimer = null;
    let currentProgress = 0;

    // Character counter
    promptTextarea.addEventListener('input', function() {
        const count = this.value.length;
        charCountSpan.textContent = count;
        if (count > 0) {
            quickPromptChips.forEach(chip => chip.classList.remove('active'));
        }
    });
    
    // Aspect ratio selection
    aspectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            aspectBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentAspectRatio = this.getAttribute('data-ratio');
        });
    });
    
    // History sidebar toggle
    historyToggleBtn.addEventListener('click', () => {
        historySidebar.classList.toggle('open');
    });
    
    // Clear history
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('确定要清空所有生成记录吗？')) {
            generationHistory = [];
            saveHistory();
            renderHistory();
            updateDashboard();
            showNotification('历史记录已清空', 'info');
        }
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (historySidebar.classList.contains('open') && 
            !historySidebar.contains(e.target) && 
            !historyToggleBtn.contains(e.target)) {
            historySidebar.classList.remove('open');
        }
    });
    
    // Toggle log visibility
    logToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        logWrapper.classList.toggle('collapsed');
    });

    // Mode switching
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.getAttribute('data-mode');
            if (mode === currentMode) return;

            // Update active state
            modeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            currentMode = mode;

            // Toggle UI elements
            if (mode === 'image') {
                imageUploadPanel.style.display = 'block';
                imageUploadPanel.classList.add('active');
                promptLabel.textContent = '视频描述（可选）';
                promptHelper.textContent = '可补充动画方向、镜头运动、画面节奏等信息';
                promptTextarea.placeholder = '描述动画需求，例如：镜头环绕角色一圈并营造梦幻光影';
            } else {
                imageUploadPanel.style.display = 'none';
                imageUploadPanel.classList.remove('active');
                promptLabel.textContent = '视频描述';
                promptHelper.textContent = '详细描述你想要的镜头、风格与氛围';
                promptTextarea.placeholder = '描述您想要生成的视频内容，例如：小猫在阳光下吃鱼';
                // Clear image
                clearImage();
            }
        });
    });

    // Image upload - Click
    uploadPlaceholder.addEventListener('click', () => {
        imageUpload.click();
    });

    // Image upload - Change
    imageUpload.addEventListener('change', handleImageSelect);

    // Image upload - Drag and drop
    imageUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadPlaceholder.style.borderColor = 'var(--primary-color)';
        uploadPlaceholder.style.background = 'var(--border-color)';
    });

    imageUploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadPlaceholder.style.borderColor = '';
        uploadPlaceholder.style.background = '';
    });

    imageUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadPlaceholder.style.borderColor = '';
        uploadPlaceholder.style.background = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            handleImageFile(files[0]);
        }
    });

    // Remove image
    removeImageBtn.addEventListener('click', clearImage);
    
    // Video player events
    videoPlayer.addEventListener('loadstart', () => {
        videoLoading.classList.remove('hidden');
    });
    
    videoPlayer.addEventListener('canplay', () => {
        videoLoading.classList.add('hidden');
    });
    
    videoPlayer.addEventListener('error', () => {
        videoLoading.classList.add('hidden');
        addLog('✗ 视频加载失败', 'error');
    });
    
    // Copy video URL
    copyVideoUrlBtn.addEventListener('click', async () => {
        if (currentVideoUrl) {
            try {
                await navigator.clipboard.writeText(currentVideoUrl);
                showNotification('视频链接已复制到剪贴板！', 'success');
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = currentVideoUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('视频链接已复制！', 'success');
            }
        }
    });

    // Quick prompts
    quickPromptChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const prompt = this.getAttribute('data-prompt');
            quickPromptChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            promptTextarea.value = prompt;
            promptTextarea.dispatchEvent(new Event('input'));
            promptTextarea.focus();
        });
    });

    viewHistoryBtn.addEventListener('click', () => {
        historySidebar.classList.add('open');
    });

    openDocsBtn.addEventListener('click', () => {
        window.open('使用说明.md', '_blank');
    });

    // Generate button
    generateBtn.addEventListener('click', async function() {
        const prompt = promptTextarea.value.trim();
        const resolution = resolutionSelect.value;
        
        // Validation
        if (currentMode === 'text' && !prompt) {
            showError('请输入视频描述');
            return;
        }
        
        if (currentMode === 'image' && !uploadedImageBase64) {
            showError('请上传参考图片');
            return;
        }

        if (isGenerating) {
            return;
        }

        await generateVideo(prompt, resolution, uploadedImageBase64, currentAspectRatio);
    });

    // Image handling functions
    function handleImageSelect(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageFile(file);
        }
    }

    function handleImageFile(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImageBase64 = e.target.result;
            previewImg.src = uploadedImageBase64;
            uploadPlaceholder.style.display = 'none';
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    function clearImage() {
        uploadedImageBase64 = null;
        imageUpload.value = '';
        previewImg.src = '';
        uploadPlaceholder.style.display = 'block';
        imagePreview.style.display = 'none';
    }

    // Generate video function
    async function generateVideo(prompt, resolution, imageBase64 = null, aspectRatio = '16:9') {
        isGenerating = true;
        updateStatus('generating', '正在生成...');
        updateButton(true);
        clearOutput();
        clearLog();
        
        // Initialize progress
        showProgress();
        resetProgress();
        startProgressTimer();
        const startTime = Date.now();
        
        // Create history item
        const historyItem = {
            id: Date.now(),
            prompt: prompt,
            resolution: resolution,
            aspectRatio: aspectRatio,
            mode: currentMode,
            timestamp: new Date().toISOString(),
            videoUrl: null,
            status: 'generating',
            duration: 0
        };
        currentHistoryId = historyItem.id;
        generationHistory.unshift(historyItem);
        saveHistory();
        renderHistory();
        updateDashboard();

        // Build full prompt with resolution and aspect ratio
        let fullPrompt = prompt;
        if (currentMode === 'text') {
            const aspectText = aspectRatio === '16:9' ? '横屏' : aspectRatio === '9:16' ? '竖屏' : '方形';
            fullPrompt = `生成一个 ${resolution} ${aspectText} 的${prompt}`;
        }

        try {
            const requestData = {
                prompt: fullPrompt,
                resolution: resolution,
                aspectRatio: aspectRatio,
                mode: currentMode
            };

            if (imageBase64) {
                requestData.image = imageBase64;
            }
            
            // 添加日志查看实际发送的参数
            console.log('发送参数:', {
                resolution,
                aspectRatio,
                mode: currentMode,
                promptPreview: fullPrompt.substring(0, 50) + '...'
            });

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                
                if (done) {
                    break;
                }

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep the last incomplete line in buffer

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        
                        if (data.trim() === '[DONE]') {
                            updateStatus('ready', '完成');
                            addLog('✓ 生成完成', 'success');
                            break;
                        }

                        try {
                            const jsonData = JSON.parse(data);
                            
                            if (jsonData.error) {
                                throw new Error(jsonData.error);
                            }

                            // Handle the response data
                            if (jsonData.choices && jsonData.choices.length > 0) {
                                const choice = jsonData.choices[0];
                                let content = '';

                                if (choice.delta && choice.delta.content) {
                                    content = choice.delta.content;
                                } else if (choice.message && choice.message.content) {
                                    content = choice.message.content;
                                }

                                if (content) {
                                    appendToOutput(content);
                                    addLog(`收到数据: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`);
                                    
                                    // Update progress based on content
                                    updateProgressFromContent(content);
                                    
                                    // Check for video URL
                                    const videoUrl = extractVideoUrl(content);
                                    if (videoUrl) {
                                        completeProgress();
                                        loadVideo(videoUrl);
                                        updateHistoryVideoUrl(currentHistoryId, videoUrl);
                                        hideProgress();
                                    }
                                }
                            }
                        } catch (parseError) {
                            console.warn('Failed to parse JSON:', data, parseError);
                            // Some lines might not be JSON, just log them
                            if (data.trim()) {
                                addLog(data);
                                
                                // Also check for video URL in non-JSON data
                                updateProgressFromContent(data);
                                
                                const videoUrl = extractVideoUrl(data);
                                if (videoUrl) {
                                    completeProgress();
                                    loadVideo(videoUrl);
                                    updateHistoryVideoUrl(currentHistoryId, videoUrl);
                                    hideProgress();
                                }
                            }
                        }
                    }
                }
            }

        } catch (error) {
            console.error('Error:', error);
            updateStatus('error', '错误');
            showError(`生成失败: ${error.message}`);
            addLog(`✗ 错误: ${error.message}`, 'error');
            updateHistoryStatus(currentHistoryId, 'error');
            hideProgress();
            stopProgressTimer();
        } finally {
            isGenerating = false;
            updateButton(false);
            const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
            const item = generationHistory.find(h => h.id === currentHistoryId);
            if (item && durationSeconds > 0) {
                item.duration = durationSeconds;
                saveHistory();
                updateDashboard();
            }
        }
    }

    // UI Helper Functions
    function updateStatus(state, text) {
        statusIndicator.className = `status-indicator ${state}`;
        statusIndicator.querySelector('.status-text').textContent = text;
    }

    function updateButton(loading) {
        generateBtn.disabled = loading;
        const btnText = generateBtn.querySelector('.btn-text');
        const btnIcon = generateBtn.querySelector('.btn-icon');

        if (loading) {
            generateBtn.classList.add('loading');
            btnText.textContent = '生成中...';
            btnIcon.innerHTML = '<circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path>';
        } else {
            generateBtn.classList.remove('loading');
            btnText.textContent = '生成视频';
            btnIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
        }
    }

    function clearOutput() {
        outputContent.innerHTML = `
            <div class="placeholder">
                <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                    <line x1="7" y1="2" x2="7" y2="22"></line>
                    <line x1="17" y1="2" x2="17" y2="22"></line>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <line x1="2" y1="7" x2="7" y2="7"></line>
                    <line x1="2" y1="17" x2="7" y2="17"></line>
                    <line x1="17" y1="17" x2="22" y2="17"></line>
                    <line x1="17" y1="7" x2="22" y2="7"></line>
                </svg>
                <p>正在生成，请稍候...</p>
            </div>
        `;
    }

    function appendToOutput(content) {
        // Remove placeholder if it exists
        const placeholder = outputContent.querySelector('.placeholder');
        if (placeholder) {
            outputContent.innerHTML = '';
        }

        // Create content container if it doesn't exist
        let contentDiv = outputContent.querySelector('.content');
        if (!contentDiv) {
            contentDiv = document.createElement('div');
            contentDiv.className = 'content';
            outputContent.appendChild(contentDiv);
        }

        // Append content
        const textNode = document.createTextNode(content);
        contentDiv.appendChild(textNode);

        // Auto-scroll
        outputContent.scrollTop = outputContent.scrollHeight;
    }

    function showError(message) {
        outputContent.innerHTML = `
            <div class="placeholder" style="color: var(--danger-color);">
                <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <p>${message}</p>
            </div>
        `;
    }

    function clearLog() {
        responseLog.innerHTML = '';
    }

    function addLog(message, type = 'info') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        
        const timestamp = new Date().toLocaleTimeString('zh-CN');
        entry.textContent = `[${timestamp}] ${message}`;
        
        responseLog.appendChild(entry);
        responseLog.scrollTop = responseLog.scrollHeight;
    }
    
    // Video URL extraction
    function extractVideoUrl(text) {
        // Look for URLs in the text
        const urlRegex = /https?:\/\/[^\s\)]+/g;
        const matches = text.match(urlRegex);
        
        if (matches) {
            for (const url of matches) {
                // Check if it's a video URL
                if (url.includes('videos.openai.com') || 
                    url.includes('.mp4') || 
                    url.includes('/video') ||
                    url.includes('vg-assets')) {
                    return url.split(/[)\s]/)[0]; // Clean up URL
                }
            }
        }
        return null;
    }
    
    // Load video into player
    function loadVideo(url) {
        currentVideoUrl = url;
        
        // Show video player
        videoPlayerContainer.style.display = 'block';
        videoLoading.classList.remove('hidden');
        
        // Set video source
        videoSource.src = url;
        videoPlayer.load();
        
        // Set download link
        downloadVideoBtn.href = url;
        downloadVideoBtn.download = `sora_video_${Date.now()}.mp4`;
        
        addLog(`✓ 视频加载成功！`, 'success');
        
        // Scroll to video player
        videoPlayerContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // History management functions
    function saveHistory() {
        try {
            localStorage.setItem('soraHistory', JSON.stringify(generationHistory));
        } catch (e) {
            console.error('Failed to save history:', e);
        }
    }
    
    function loadHistory() {
        try {
            const saved = localStorage.getItem('soraHistory');
            if (saved) {
                generationHistory = JSON.parse(saved);
                renderHistory();
            }
        } catch (e) {
            console.error('Failed to load history:', e);
            generationHistory = [];
        }
    }
    
    function renderHistory() {
        updateDashboard();
        historyBadge.textContent = generationHistory.length || '';
        
        if (generationHistory.length === 0) {
            historyList.innerHTML = `
                <div class="history-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <p>暂无生成记录</p>
                </div>
            `;
            return;
        }
        
        historyList.innerHTML = generationHistory.map(item => {
            const date = new Date(item.timestamp);
            const timeStr = date.toLocaleString('zh-CN', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const modeText = item.mode === 'text' ? '文生视频' : '图生视频';
            const statusClass = item.status === 'error' ? 'error' : item.videoUrl ? 'success' : 'generating';
            
            return `
                <div class="history-item ${item.id === currentHistoryId ? 'active' : ''}" data-id="${item.id}">
                    <div class="history-item-header">
                        <div class="history-item-info">
                            <h4>${item.prompt.substring(0, 30)}${item.prompt.length > 30 ? '...' : ''}</h4>
                            <div class="history-item-time">${timeStr}</div>
                        </div>
                        <div class="history-item-badge ${statusClass}">${modeText}</div>
                    </div>
                    <div class="history-item-prompt">${item.prompt}</div>
                    <div class="history-item-meta">
                        <span>📐 ${item.resolution}</span>
                        <span>📺 ${item.aspectRatio}</span>
                        ${item.videoUrl ? '<span>✅ 已完成</span>' : item.status === 'error' ? '<span>❌ 失败</span>' : '<span>⏳ 生成中</span>'}
                    </div>
                </div>
            `;
        }).join('');
        
        // Add click handlers
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                loadHistoryItem(id);
            });
        });
    }
    
    function loadHistoryItem(id) {
        const item = generationHistory.find(h => h.id === id);
        if (!item) return;
        
        currentHistoryId = id;
        
        // Update UI
        promptTextarea.value = item.prompt;
        promptTextarea.dispatchEvent(new Event('input'));
        
        resolutionSelect.setValue(item.resolution);
        
        aspectBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-ratio') === item.aspectRatio);
        });
        currentAspectRatio = item.aspectRatio;
        
        // Load video if available
        if (item.videoUrl) {
            loadVideo(item.videoUrl);
            updateStatus('ready', '完成');
        }
        
        renderHistory();
        historySidebar.classList.remove('open');
        showNotification('已加载历史记录', 'success');
    }
    
    function updateHistoryVideoUrl(id, url) {
        const item = generationHistory.find(h => h.id === id);
        if (item) {
            item.videoUrl = url;
            item.status = 'completed';
            if (!item.duration) {
                item.duration = Math.floor((Date.now() - progressStartTime) / 1000);
            }
            item.completedAt = new Date().toISOString();
            saveHistory();
            renderHistory();
            updateDashboard();
        }
    }
    
    function updateHistoryStatus(id, status) {
        const item = generationHistory.find(h => h.id === id);
        if (item) {
            item.status = status;
            saveHistory();
            renderHistory();
            updateDashboard();
        }
    }

    function updateDashboard() {
        const total = generationHistory.length;
        totalGenerationsEl.textContent = total;

        const today = new Date().toDateString();
        const todayCount = generationHistory.filter(item => new Date(item.timestamp).toDateString() === today).length;
        todayCountEl.textContent = `今日 +${todayCount}`;

        const completed = generationHistory.filter(item => item.videoUrl);
        if (completed.length > 0) {
            const durations = completed.slice(0, 5).map(item => item.duration || 0).filter(Boolean);
            if (durations.length > 0) {
                const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
                avgDurationEl.textContent = formatDuration(avg);
                const lastDuration = durations[0];
                lastDurationEl.textContent = `上次 ${formatDuration(lastDuration)}`;
            } else {
                avgDurationEl.textContent = '00:00';
                lastDurationEl.textContent = '上次 00:00';
            }

            const last = completed[0];
            const time = new Date(last.timestamp).toLocaleString('zh-CN', { hour12: false });
            lastGeneratedAtEl.textContent = time;
            lastModeEl.textContent = last.mode === 'text' ? '文生视频' : '图生视频';
            lastParamsEl.innerHTML = `
                <span class="chip">${last.resolution}</span>
                <span class="chip">${last.aspectRatio}</span>
            `;
        } else {
            avgDurationEl.textContent = '00:00';
            lastDurationEl.textContent = '上次 00:00';
            lastGeneratedAtEl.textContent = '暂无';
            lastModeEl.textContent = '-';
            lastParamsEl.innerHTML = `<span class="chip">-</span>`;
        }
    }

    function formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Progress functions
    function showProgress() {
        progressContainer.style.display = 'block';
        progressContainer.classList.add('visible');
        outputContent.style.display = 'none';
    }
    
    function hideProgress() {
        setTimeout(() => {
            progressContainer.classList.remove('visible');
            progressContainer.style.display = 'none';
            outputContent.style.display = 'block';
        }, 500);
    }
    
    function resetProgress() {
        currentProgress = 0;
        progressStartTime = Date.now();
        updateProgressUI(0, '初始化中...');
        updateStages(0);
    }
    
    function startProgressTimer() {
        progressTimer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - progressStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            elapsedTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Auto-increment progress slowly if no updates
            if (currentProgress < 90 && !isGenerating) {
                const autoProgress = Math.min(90, currentProgress + 0.1);
                updateProgressUI(autoProgress, progressMessage.textContent);
            }
        }, 1000);
    }
    
    function stopProgressTimer() {
        if (progressTimer) {
            clearInterval(progressTimer);
            progressTimer = null;
        }
    }
    
    function updateProgressUI(percentage, message) {
        currentProgress = Math.min(100, Math.max(0, percentage));
        progressBarFill.style.width = `${currentProgress}%`;
        progressPercentage.textContent = `${Math.round(currentProgress)}%`;
        if (message) {
            progressMessage.textContent = message;
        }
        updateStages(currentProgress);
        
        // Update estimated time
        if (currentProgress > 5 && currentProgress < 95) {
            const elapsed = (Date.now() - progressStartTime) / 1000;
            const estimated = (elapsed / currentProgress) * (100 - currentProgress);
            const estMinutes = Math.floor(estimated / 60);
            const estSeconds = Math.floor(estimated % 60);
            estimatedTime.textContent = `预计：${estMinutes}:${estSeconds.toString().padStart(2, '0')}`;
        }
    }
    
    function updateStages(percentage) {
        const stages = document.querySelectorAll('.stage');
        stages.forEach(stage => {
            const stageValue = parseInt(stage.getAttribute('data-stage'));
            if (percentage >= stageValue) {
                stage.classList.add('completed');
                stage.classList.remove('active');
            } else if (percentage >= stageValue - 12.5) {
                stage.classList.add('active');
                stage.classList.remove('completed');
            } else {
                stage.classList.remove('active', 'completed');
            }
        });
    }
    
    function updateProgressFromContent(content) {
        // Extract percentage from content
        const percentageMatch = content.match(/(\d+(?:\.\d+)?)\s*%/);
        if (percentageMatch) {
            const percentage = parseFloat(percentageMatch[1]);
            updateProgressUI(percentage, `生成中... ${percentage.toFixed(1)}%`);
            return;
        }
        
        // Extract progress indicators from text
        const progressKeywords = {
            '初始化': 5,
            '任务': 10,
            '队列': 15,
            '开始': 20,
            '分析': 30,
            '理解': 35,
            '处理': 40,
            '渲染': 50,
            '生成': 60,
            '合成': 70,
            '优化': 80,
            '完成': 95,
            '成功': 100
        };
        
        for (const [keyword, progress] of Object.entries(progressKeywords)) {
            if (content.includes(keyword) && progress > currentProgress) {
                updateProgressUI(progress, `${keyword}中...`);
                break;
            }
        }
        
        // Gradual progress update
        if (currentProgress < 90) {
            updateProgressUI(currentProgress + 2, progressMessage.textContent);
        }
    }
    
    function completeProgress() {
        stopProgressTimer();
        updateProgressUI(100, '视频生成成功！');
        estimatedTime.textContent = '已完成';

        const item = generationHistory.find(h => h.id === currentHistoryId);
        if (item) {
            item.duration = Math.floor((Date.now() - progressStartTime) / 1000);
            saveHistory();
            updateDashboard();
        }

        // Show completion animation
        setTimeout(() => {
            progressContainer.style.opacity = '0';
            setTimeout(() => {
                progressContainer.style.opacity = '1';
            }, 300);
        }, 500);
    }

    // Initialize
    updateStatus('ready', '就绪');
    loadHistory();
    updateDashboard();
    refreshApiStatus();
    console.log('Sora Video Generator initialized');

    async function refreshApiStatus() {
        try {
            const res = await fetch('/api/health');
            if (res.ok) {
                apiStatus.classList.add('online');
                apiStatus.classList.remove('offline');
                return;
            }
        } catch (e) {
            // ignore
        }
        apiStatus.classList.remove('online');
        apiStatus.classList.add('offline');
    }
});

