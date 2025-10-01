import React, { useState } from 'react';
import { Car, Wrench, IndianRupee, AlertCircle } from 'lucide-react';
import './CarServiceApp.css';

// Function Component for Car Service Management
export default function CarServiceApp() {
  const [formData, setFormData] = useState({
    customerName: '',
    carModel: '',
    serviceType: '',
    repairs: [],
    carType: '',
    urgency: 'normal'
  });
  
  const [errors, setErrors] = useState({});
  const [totalCost, setTotalCost] = useState(null);
  const [breakdown, setBreakdown] = useState(null);

  const servicePrices = {
    basic: 1500,
    standard: 3500,
    comprehensive: 6500,
    premium: 12000
  };

  const repairPrices = {
    oilChange: 800,
    brakeService: 2500,
    tyreMaintenance: 3000,
    acService: 2000,
    engineTuning: 4500,
    batteryReplacement: 3500
  };

  const carTypeMultipliers = {
    hatchback: 1.0,
    sedan: 1.2,
    suv: 1.5,
    luxury: 2.0
  };

  const urgencyMultipliers = {
    normal: 1.0,
    express: 1.5
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    } else if (formData.customerName.length < 3) {
      newErrors.customerName = 'Name must be at least 3 characters';
    }

    if (!formData.carModel) {
      newErrors.carModel = 'Please select a car model';
    }

    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select a service type';
    }

    if (!formData.carType) {
      newErrors.carType = 'Please select your car type';
    }

    if (formData.repairs.length === 0) {
      newErrors.repairs = 'Please select at least one repair service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateCost = () => {
    if (!validateForm()) {
      return;
    }

    let cost = 0;
    let details = {
      baseService: 0,
      repairs: [],
      subtotal: 0,
      carTypeMultiplier: 1,
      urgencyMultiplier: 1,
      gst: 0
    };

    if (formData.serviceType) {
      details.baseService = servicePrices[formData.serviceType];
      cost += details.baseService;
    }

    formData.repairs.forEach(repair => {
      const repairCost = repairPrices[repair];
      details.repairs.push({ name: repair, cost: repairCost });
      cost += repairCost;
    });

    details.subtotal = cost;

    if (formData.carType) {
      details.carTypeMultiplier = carTypeMultipliers[formData.carType];
      cost *= details.carTypeMultiplier;
    }

    if (formData.urgency === 'express') {
      details.urgencyMultiplier = urgencyMultipliers.express;
      cost *= details.urgencyMultiplier;
    }

    details.gst = cost * 0.18;
    cost += details.gst;

    setTotalCost(Math.round(cost));
    setBreakdown(details);
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData(prev => ({
        ...prev,
        repairs: [...prev.repairs, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        repairs: prev.repairs.filter(r => r !== value)
      }));
    }
  };

  const handleRadioChange = (e) => {
    setFormData(prev => ({
      ...prev,
      serviceType: e.target.value
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      carModel: '',
      serviceType: '',
      repairs: [],
      carType: '',
      urgency: 'normal'
    });
    setErrors({});
    setTotalCost(null);
    setBreakdown(null);
  };

  return (
    <div className="app-container">
      <div className="max-width-wrapper">
        <div className="header-card">
          <div className="header-content">
            <Car size={32} color="#4F46E5" />
            <h1 className="main-title">Car Service Management</h1>
          </div>
          <p className="subtitle">Calculate your car service cost based on repair type and service package</p>
        </div>

        <div className="form-card">
          <div className="form-container">
            <div className="form-group">
              <label className="form-label">Customer Name *</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your full name"
              />
              {errors.customerName && (
                <p className="error-message">
                  <AlertCircle size={16} /> {errors.customerName}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Car Model * (Dropdown)</label>
              <select
                name="carModel"
                value={formData.carModel}
                onChange={handleSelectChange}
                className="form-select"
              >
                <option value="">Select your car model</option>
                <option value="maruti_swift">Maruti Swift</option>
                <option value="hyundai_i20">Hyundai i20</option>
                <option value="honda_city">Honda City</option>
                <option value="maruti_dzire">Maruti Dzire</option>
                <option value="tata_nexon">Tata Nexon</option>
                <option value="mahindra_xuv700">Mahindra XUV700</option>
                <option value="kia_seltos">Kia Seltos</option>
              </select>
              {errors.carModel && (
                <p className="error-message">
                  <AlertCircle size={16} /> {errors.carModel}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Car Type * (Dropdown)</label>
              <select
                name="carType"
                value={formData.carType}
                onChange={handleSelectChange}
                className="form-select"
              >
                <option value="">Select car type</option>
                <option value="hatchback">Hatchback (Base Price)</option>
                <option value="sedan">Sedan (+20%)</option>
                <option value="suv">SUV (+50%)</option>
                <option value="luxury">Luxury (+100%)</option>
              </select>
              {errors.carType && (
                <p className="error-message">
                  <AlertCircle size={16} /> {errors.carType}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Service Package * (Radio Buttons)</label>
              <div className="radio-grid">
                {[
                  { value: 'basic', label: 'Basic Service', price: 1500, desc: 'Oil & Filter' },
                  { value: 'standard', label: 'Standard Service', price: 3500, desc: 'Complete Check-up' },
                  { value: 'comprehensive', label: 'Comprehensive', price: 6500, desc: 'Full Service' },
                  { value: 'premium', label: 'Premium Service', price: 12000, desc: 'Complete Overhaul' }
                ].map(service => (
                  <label key={service.value} className="radio-label">
                    <input
                      type="radio"
                      name="serviceType"
                      value={service.value}
                      checked={formData.serviceType === service.value}
                      onChange={handleRadioChange}
                      className="radio-input"
                    />
                    <div className="radio-content">
                      <div className="radio-title">{service.label}</div>
                      <div className="radio-desc">{service.desc}</div>
                      <div className="radio-price">₹{service.price}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.serviceType && (
                <p className="error-message">
                  <AlertCircle size={16} /> {errors.serviceType}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Additional Repairs * (Checkboxes)</label>
              <div className="checkbox-grid">
                {[
                  { value: 'oilChange', label: 'Oil Change', price: 800 },
                  { value: 'brakeService', label: 'Brake Service', price: 2500 },
                  { value: 'tyreMaintenance', label: 'Tyre Maintenance', price: 3000 },
                  { value: 'acService', label: 'AC Service', price: 2000 },
                  { value: 'engineTuning', label: 'Engine Tuning', price: 4500 },
                  { value: 'batteryReplacement', label: 'Battery Replacement', price: 3500 }
                ].map(repair => (
                  <label key={repair.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={repair.value}
                      checked={formData.repairs.includes(repair.value)}
                      onChange={handleCheckboxChange}
                      className="checkbox-input"
                    />
                    <div className="checkbox-content">
                      <div className="checkbox-title">{repair.label}</div>
                      <div className="checkbox-price">₹{repair.price}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.repairs && (
                <p className="error-message">
                  <AlertCircle size={16} /> {errors.repairs}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Service Urgency (Dropdown)</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleSelectChange}
                className="form-select"
              >
                <option value="normal">Normal (Standard Timeline)</option>
                <option value="express">Express Service (+50% charges)</option>
              </select>
            </div>

            <div className="button-container">
              <button
                type="button"
                onClick={calculateCost}
                className="calculate-button"
              >
                <Wrench size={20} />
                Calculate Cost
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="reset-button"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {totalCost !== null && breakdown && (
          <div className="breakdown-card">
            <h2 className="breakdown-title">
              <IndianRupee size={24} color="#16A34A" />
              Cost Breakdown
            </h2>
            <div className="breakdown-content">
              <div className="breakdown-row">
                <span className="breakdown-label">Base Service:</span>
                <span className="breakdown-value">₹{breakdown.baseService.toFixed(2)}</span>
              </div>
              {breakdown.repairs.map((repair, idx) => (
                <div key={idx} className="breakdown-row">
                  <span className="breakdown-label">{repair.name}:</span>
                  <span className="breakdown-value">₹{repair.cost.toFixed(2)}</span>
                </div>
              ))}
              <div className="breakdown-row">
                <span className="breakdown-label">Subtotal:</span>
                <span className="breakdown-value">₹{breakdown.subtotal.toFixed(2)}</span>
              </div>
              <div className="breakdown-row">
                <span className="breakdown-label">Car Type Multiplier (×{breakdown.carTypeMultiplier}):</span>
                <span className="breakdown-value multiplier-applied">Applied</span>
              </div>
              {breakdown.urgencyMultiplier > 1 && (
                <div className="breakdown-row">
                  <span className="breakdown-label">Express Service (×{breakdown.urgencyMultiplier}):</span>
                  <span className="breakdown-value express-applied">Applied</span>
                </div>
              )}
              <div className="breakdown-row">
                <span className="breakdown-label">GST (18%):</span>
                <span className="breakdown-value">₹{breakdown.gst.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span className="total-label">Total Amount:</span>
                <span className="total-value">₹{totalCost}</span>
              </div>
            </div>
          </div>
        )}

        <div className="info-card">
          <h3 className="info-title">How It Works</h3>
          <div className="info-content">
            <p className="info-paragraph"><strong>This Car Service Cost Calculator helps you estimate the total service cost for your vehicle.</strong></p>
            <p className="info-paragraph">The app calculates costs based on selected service package (Basic, Standard, Comprehensive, or Premium), additional repair services required with multiple selections allowed via checkboxes, your car type via dropdown affecting pricing multiplier (Hatchback, Sedan, SUV, or Luxury), service urgency dropdown where express adds 50% to cost, and automatic GST calculation at 18% following Indian tax rates.</p>
            <p className="info-paragraph"><strong>Features:</strong> Comprehensive form validation for all required fields, real-time cost calculation with detailed breakdown showing all charges, India-specific pricing in Rupees with popular Indian car models, and uses functional React components with hooks for state management.</p>
            <p className="info-paragraph"><strong>Form Elements:</strong> Three dropdown lists (Car Model, Car Type, Service Urgency), radio buttons for service package selection, checkboxes for multiple repair selections, and text input with validation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}