import create from 'zustand';

const courseStore = (set) => ({
    auth: false,
    setAuth: (value:boolean) => set({ auth: value }),
})

const useCourseStore = create(courseStore)

export default useCourseStore