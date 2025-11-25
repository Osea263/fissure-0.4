import React from 'react';
import { DataField } from './DataField';

// Tier logic remains the same
const getRewardTier = (score) => {
    if (score >= 200) return 'ELITE';
    if (score >= 150) return 'TIER 2';
    return 'TIER 1';
};

export const CertificateDisplay = ({ id, handle, score }) => {
    
    const rewardTier = getRewardTier(score);
    const digitClaim = (id <= 15) ? 'ELIGIBLE' : 'NOT ELIGIBLE';

    return (
        <div className=" py-6 md:py-8 rounded-lg space-y-6">
            
            <div className="pb-4 border-b border-gray-700">
                <h2 className="text-2xl font-semibold text-white">
                    Architect's Credentials
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                    This certificate proves your technical mastery of the MegaETH protocol.
                </p>
            </div>

            
            <div>
                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                    Architect Details
                </h3>
                <div className="space-y-1">
                    <DataField 
                        label="Architect's Handle" 
                        value={handle} 
                        
                    />
                    <DataField 
                        label="Architect's Score" 
                        value={`${score} POINTS`}
                        tooltipText="Your total accumulated score from all trivia sessions."
                    />
                    <DataField 
                        label="Reward Tier" 
                        value={rewardTier}
                        tooltipText="Your reward tier based on your total score. (e.g., 200+ = ELITE)"
                    />
                </div>
            </div>

            
            <div>
                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                    Certificate Data
                </h3>
                <div className="space-y-1">
                    <DataField 
                        label="Certificate Series" 
                        value={id}
                        tooltipText="Your unique submission ID. This is your place in the submission queue."
                    />
                    <DataField 
                        label="Protocol ID" 
                        value="FISSURE 0.4"
                        
                    />
                    <DataField 
                        label="Issuing Authority" 
                        value="MEGAETH"
                       
                    />
                </div>
            </div>
            
            
            <div>
                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                    Claims
                </h3>
                <div className="space-y-1">
                    <DataField 
                        label="Digit Rabbits Claim" 
                        value={digitClaim}
                        tooltipText="eligibility for the Digit Rabbits. This is reserved for the first 15 wallet submissions."
                    />
                    <DataField 
                        label="Remnant NFT GTD Spot" 
                        value="ELIGIBLE"
                        tooltipText="GTD spot for the upcoming Remnant NFT"
                    />
                </div>
            </div>
        </div>
    );
};