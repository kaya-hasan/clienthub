import { useState } from "react"
import { createCustomer } from "../services/customerService";



function CustomerForm({ onCustomerCreated, texts }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    businessType: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (formData.name.trim() === "" || formData.phone.trim() === "") {
      setFormError(texts.validationRequired)
      return
    }
    setFormError("")
    setIsSubmitting(true)
    try {
      await createCustomer(formData)
      setFormData({ name: "", phone: "", email: "", city: "", businessType: "", notes: "" })
      await onCustomerCreated();
    }
    catch (error) {
      alert(error.message)
    }
    finally {
      setIsSubmitting(false)
    }
  }


  return (
    <section className="form-panel">
      <h3>{texts.title}</h3>
      <form className="customer-form" onSubmit={handleSubmit}>
        <label>{texts.name}</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
        <label>{texts.phone}</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        <label>{texts.email}</label>
        <input type="text" name="email" value={formData.email} onChange={handleChange} />
        <label>{texts.city}</label>
        <input type="text" name="city" value={formData.city} onChange={handleChange} />
        <label>{texts.businessType}</label>
        <input type="text" name="businessType" value={formData.businessType} onChange={handleChange} />
        <label>{texts.notes}</label>
        <textarea rows="10" name="notes" value={formData.notes} onChange={handleChange} />

        {formError && <p className="form-error">{formError}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? texts.saving : texts.save}
        </button>
      </form>
    </section>
  )
}

export default CustomerForm
