import { labels, getLabel, getLabelSafe } from '@/utils/labels'

/**
 * Composable for using labels in Vue components
 * Provides easy access to centralized labels with interpolation support
 */
export function useLabels() {
    /**
     * Get a label with optional data interpolation
     * @param {string} path - Dot notation path to the label
     * @param {object} data - Data for interpolation
     * @returns {string} - The label text
     */
    const t = (path, data = {}) => {
        return getLabel(path, data)
    }

    /**
     * Get a label safely with fallback
     * @param {string} path - Dot notation path to the label
     * @param {string} fallback - Fallback text if label not found
     * @returns {string} - The label text or fallback
     */
    const tSafe = (path, fallback = '') => {
        return getLabelSafe(path, fallback)
    }

    /**
     * Get multiple labels at once
     * @param {string[]} paths - Array of dot notation paths
     * @param {object} data - Data for interpolation
     * @returns {object} - Object with paths as keys and labels as values
     */
    const tMultiple = (paths, data = {}) => {
        const result = {}
        paths.forEach(path => {
            const key = path.split('.').pop() // Use last part of path as key
            result[key] = getLabel(path, data)
        })
        return result
    }

    /**
     * Get all labels for a specific section
     * @param {string} section - Section name (e.g., 'auth.login')
     * @param {object} data - Data for interpolation
     * @returns {object} - Object with all labels in the section
     */
    const tSection = (section, data = {}) => {
        const keys = section.split('.')
        let value = labels

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key]
            } else {
                return {}
            }
        }

        if (typeof value === 'object' && value !== null) {
            const result = {}
            const processObject = (obj, prefix = '') => {
                for (const [key, val] of Object.entries(obj)) {
                    const fullPath = prefix ? `${prefix}.${key}` : key
                    if (typeof val === 'string') {
                        result[key] = val.replace(/\{\{(\w+)\}\}/g, (match, key) => {
                            return data[key] || match
                        })
                    } else if (typeof val === 'object' && val !== null) {
                        processObject(val, fullPath)
                    }
                }
            }
            processObject(value)
            return result
        }

        return {}
    }

    return {
        t,
        tSafe,
        tMultiple,
        tSection,
        labels // Direct access to labels object
    }
}

export default useLabels
