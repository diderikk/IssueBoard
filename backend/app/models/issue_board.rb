class IssueBoard < ApplicationRecord
	has_and_belongs_to_many :users
	belongs_to :group, optional: true
	has_many :issue_labels, dependent: :destroy
	belongs_to :owner, class_name: "User"

	validates :name, :owner, presence: true
	validate :either_user_or_group?


	private

	def either_user_or_group?
		errors.add("either group or user must be defined, not both") if 
		((users.length() == 0 && group.nil?) || (users.length() > 0 && group.present?))
	end
end
